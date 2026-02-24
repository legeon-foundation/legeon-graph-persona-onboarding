/**
 * Tests for OnboardingVault (encrypted local persistence).
 *
 * Covers:
 *  - Encryption round-trip (encrypt → decrypt → same data)
 *  - Encrypted blob does not contain plaintext PII
 *  - vault.reset() removes all stored state
 *  - Corrupt state fails gracefully (returns null, no crash)
 *  - Step 4 in-progress draft is restored after simulated reload (regression)
 *  - localStorage shadow always written — survives IndexedDB loss
 */

import 'fake-indexeddb/auto';
import { IDBFactory } from 'fake-indexeddb';
import { describe, it, expect, beforeEach } from 'vitest';

import {
  generateCryptoKey,
  encryptData,
  decryptData,
  bufferToBase64,
  base64ToBuffer,
} from '@/lib/vault/cryptoUtils';
import { vault } from '@/lib/vault/onboardingVault';
import { DEFAULT_ONBOARDING_STATE, type OnboardingState } from '@/types/onboarding';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function freshState(overrides: Partial<OnboardingState> = {}): OnboardingState {
  return { ...DEFAULT_ONBOARDING_STATE, ...overrides };
}

// ---------------------------------------------------------------------------
// cryptoUtils unit tests
// ---------------------------------------------------------------------------

describe('cryptoUtils', () => {
  it('encrypts and decrypts data correctly (round-trip)', async () => {
    const key = await generateCryptoKey();
    const original = { displayName: 'Alice', jurisdiction: 'UK', step: 3 };

    const encrypted = await encryptData(original, key);
    const decrypted = await decryptData(encrypted, key);

    expect(decrypted).toEqual(original);
  });

  it('encrypted blob does not contain known plaintext values', async () => {
    const key = await generateCryptoKey();
    const original = {
      displayName: 'BobSmith',
      jurisdiction: 'United Kingdom',
      skillTags: ['SAP', 'Finance'],
    };

    const encrypted = await encryptData(original, key);

    // Decode bytes to an 8-bit string so we can check substrings.
    const bytes = new Uint8Array(encrypted);
    const rawString = Array.from(bytes)
      .map((b) => String.fromCharCode(b))
      .join('');

    // PII must not appear as-is in the encrypted blob.
    expect(rawString).not.toContain('BobSmith');
    expect(rawString).not.toContain('United Kingdom');
    expect(rawString).not.toContain('jurisdiction');
    expect(rawString).not.toContain('skillTags');
  });

  it('two encryptions of the same data produce different ciphertext (IV randomisation)', async () => {
    const key = await generateCryptoKey();
    const data = { step: 1 };

    const enc1 = bufferToBase64(await encryptData(data, key));
    const enc2 = bufferToBase64(await encryptData(data, key));

    // Different IVs mean different ciphertext.
    expect(enc1).not.toBe(enc2);
  });

  it('decryption fails with wrong key', async () => {
    const key1 = await generateCryptoKey();
    const key2 = await generateCryptoKey();
    const encrypted = await encryptData({ foo: 'bar' }, key1);

    await expect(decryptData(encrypted, key2)).rejects.toThrow();
  });

  it('bufferToBase64 / base64ToBuffer are inverse operations', () => {
    const original = new Uint8Array([1, 2, 3, 255, 0, 127]);
    const b64 = bufferToBase64(original.buffer);
    const restored = new Uint8Array(base64ToBuffer(b64));
    expect(Array.from(restored)).toEqual(Array.from(original));
  });
});

// ---------------------------------------------------------------------------
// vault integration tests
// ---------------------------------------------------------------------------

describe('vault', () => {
  beforeEach(() => {
    // Reset IndexedDB and localStorage between tests.
    (global as unknown as { indexedDB: IDBFactory }).indexedDB = new IDBFactory();
    localStorage.clear();
  });

  it('save then load returns the same state', async () => {
    const state = freshState({ currentStep: 3, walletConnected: true, walletAddress: 'addr_test1q...' });
    await vault.save(state);
    const loaded = await vault.load();
    expect(loaded).toEqual(state);
  });

  it('load returns null when nothing has been saved', async () => {
    const loaded = await vault.load();
    expect(loaded).toBeNull();
  });

  it('reset removes stored state so subsequent load returns null', async () => {
    const state = freshState({ currentStep: 2 });
    await vault.save(state);

    // Confirm it was saved.
    expect(await vault.load()).not.toBeNull();

    await vault.reset();

    // After reset, load must return null.
    expect(await vault.load()).toBeNull();
  });

  it('reset also clears the localStorage fallback key', async () => {
    const state = freshState({ currentStep: 4 });
    await vault.save(state);
    await vault.reset();

    const allKeys = Object.keys(localStorage).filter((k) =>
      k.startsWith('legeon_vault'),
    );
    expect(allKeys).toHaveLength(0);
  });

  it('corrupt blob in localStorage fallback fails gracefully (returns null)', async () => {
    localStorage.setItem('legeon_vault_encrypted_v1', 'not-valid-base64!!!');
    const loaded = await vault.load();
    expect(loaded).toBeNull();
  });

  // -------------------------------------------------------------------------
  // Regression: Step 4 in-progress draft not restored after refresh
  // -------------------------------------------------------------------------

  it('restores step 4 with unconfirmed draft edits after a simulated page reload', async () => {
    // Simulate the user reaching Step 4 and editing fields WITHOUT clicking
    // "Confirm Profile" — the autosave fires while profileConfirmed is still false.
    const step4State = freshState({
      currentStep: 4,
      walletConnected: true,
      walletAddress: 'addr_test1q_mock',
      jurisdiction: 'Germany',
      profileDraft: {
        displayName: 'Alice in Progress',
        publicBio: 'Draft bio, not yet confirmed.',
        skillTags: ['SAP ERP', 'FICO'],
        experienceSummary: 'Currently editing — not yet approved.',
        extractedFromCV: true,
      },
      profileConfirmed: false, // user has NOT clicked Confirm
    });

    // Autosave path: context calls vault.save on field change.
    await vault.save(step4State);

    // Simulate reload: vault.load() picks up the persisted state.
    const loaded = await vault.load();

    expect(loaded).not.toBeNull();
    // Must restore to step 4, not step 1.
    expect(loaded?.currentStep).toBe(4);
    // All draft edits must be intact.
    expect(loaded?.profileDraft.displayName).toBe('Alice in Progress');
    expect(loaded?.profileDraft.skillTags).toEqual(['SAP ERP', 'FICO']);
    expect(loaded?.profileDraft.extractedFromCV).toBe(true);
    // Unconfirmed state must be preserved (not promoted to confirmed).
    expect(loaded?.profileConfirmed).toBe(false);
  });

  // -------------------------------------------------------------------------
  // localStorage shadow: always written, survives IndexedDB loss
  // -------------------------------------------------------------------------

  it('vault.save always writes an encrypted blob to localStorage (not only on IDB failure)', async () => {
    const state = freshState({ currentStep: 4 });
    await vault.save(state);

    // localStorage must contain an encrypted blob after every save, regardless
    // of whether IndexedDB succeeded.
    const stored = localStorage.getItem('legeon_vault_encrypted_v1');
    expect(stored).not.toBeNull();
    // It must be a non-empty base64 string, not plaintext JSON.
    expect(stored).not.toContain('"currentStep"');
  });

  it('restores step 4 from localStorage when IndexedDB is wiped (simulates storage pressure)', async () => {
    // Save with both IndexedDB and localStorage written.
    const step4State = freshState({
      currentStep: 4,
      profileDraft: {
        displayName: 'Bob Draft',
        publicBio: '',
        skillTags: [],
        experienceSummary: '',
        extractedFromCV: false,
      },
      profileConfirmed: false,
    });
    await vault.save(step4State);

    // Wipe IndexedDB (simulates browser clearing IDB under storage pressure).
    (global as unknown as { indexedDB: IDBFactory }).indexedDB = new IDBFactory();

    // Load must fall back to localStorage and still recover step 4.
    const loaded = await vault.load();
    expect(loaded?.currentStep).toBe(4);
    expect(loaded?.profileDraft.displayName).toBe('Bob Draft');
  });
});
