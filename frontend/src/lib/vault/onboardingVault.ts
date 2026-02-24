/**
 * OnboardingVault — client-only module.
 *
 * Persists the wizard's OnboardingState as an AES-GCM–encrypted blob in
 * IndexedDB, mirrored to localStorage after every successful encryption.
 *
 * Write order (every save):
 *   1. Derive/retrieve device key  (async, ~2 ms)
 *   2. Encrypt state              (async, ~5–15 ms)
 *   3. localStorage.setItem()     (synchronous ← survives page-unload races)
 *   4. IndexedDB.put()            (async, ~5–30 ms — preferred read path)
 *
 * Read order (load):
 *   1. IndexedDB (preferred — survives localStorage clears)
 *   2. localStorage fallback (survives IndexedDB loss / private browsing)
 *
 * No PII is ever logged.  Corrupt or missing state fails gracefully by
 * returning null so the caller can start fresh.
 *
 * Usage:
 *   await vault.save(state)
 *   const state = await vault.load()   // null → start fresh
 *   await vault.reset()
 */

// Client-only module: uses browser APIs (IndexedDB, localStorage, WebCrypto).

import type { OnboardingState } from '../../types/onboarding';
import {
  getOrCreateDeviceKey,
  encryptData,
  decryptData,
  clearDeviceKey,
  bufferToBase64,
  base64ToBuffer,
} from './cryptoUtils';
import {
  writeToIndexedDB,
  readFromIndexedDB,
  deleteFromIndexedDB,
} from './indexedDbStorage';

const LS_FALLBACK_KEY = 'legeon_vault_encrypted_v1';

async function writeEncrypted(state: OnboardingState): Promise<void> {
  const key = await getOrCreateDeviceKey();
  const encrypted = await encryptData(state, key);

  // Always mirror to localStorage right after encryption (step 3 in the write
  // order described above).  This write is synchronous, so it completes even
  // if the page is torn down before the IndexedDB write (step 4) finishes.
  // It also provides a fast restore path when IndexedDB is unavailable.
  localStorage.setItem(LS_FALLBACK_KEY, bufferToBase64(encrypted));

  try {
    await writeToIndexedDB(encrypted);
  } catch {
    // IndexedDB unavailable (e.g. private browsing) — localStorage already
    // updated above, so persistence is not lost.
  }
}

async function readEncrypted(): Promise<OnboardingState | null> {
  const key = await getOrCreateDeviceKey();

  let buffer: ArrayBuffer | null = null;

  try {
    buffer = await readFromIndexedDB();
  } catch {
    // IndexedDB unavailable — try localStorage fallback.
  }

  if (!buffer) {
    const b64 = localStorage.getItem(LS_FALLBACK_KEY);
    if (b64) {
      try {
        buffer = base64ToBuffer(b64);
      } catch {
        return null;
      }
    }
  }

  if (!buffer) return null;

  try {
    const decoded = (await decryptData(buffer, key)) as OnboardingState;
    // Basic shape validation — prevents crashes on version skew.
    if (typeof decoded !== 'object' || decoded === null || typeof decoded.currentStep !== 'number') {
      // State shape is invalid; discard silently.
      return null;
    }
    return decoded;
  } catch {
    // Decryption failure (corrupt data, wrong key, etc.) — start fresh.
    console.warn('[OnboardingVault] Could not decrypt saved state. Starting fresh.');
    return null;
  }
}

export const vault = {
  /** Encrypt and persist wizard state. */
  async save(state: OnboardingState): Promise<void> {
    await writeEncrypted(state);
  },

  /**
   * Load and decrypt previously persisted state.
   * Returns null when there is no saved state or the blob is corrupt.
   */
  async load(): Promise<OnboardingState | null> {
    try {
      return await readEncrypted();
    } catch {
      console.warn('[OnboardingVault] Unexpected error loading state. Starting fresh.');
      return null;
    }
  },

  /**
   * Clear all persisted state and the device key.
   * After reset, load() will return null and a new key will be generated on
   * the next save().
   */
  async reset(): Promise<void> {
    try {
      await deleteFromIndexedDB();
    } catch {
      // Ignore — already cleared or unavailable.
    }
    localStorage.removeItem(LS_FALLBACK_KEY);
    clearDeviceKey();
  },
};
