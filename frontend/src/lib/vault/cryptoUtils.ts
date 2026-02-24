/**
 * WebCrypto AES-GCM utilities for the OnboardingVault.
 *
 * Prototype key strategy: a 256-bit AES-GCM key is generated once per device
 * and its raw material is stored in localStorage (base64). This means the data
 * in IndexedDB is ciphertext, satisfying the "not readable JSON in DevTools"
 * requirement without a full KDF.
 *
 * TODO (production): Replace getOrCreateDeviceKey() with PBKDF2 or a wallet
 * signature–based KDF so the key never touches localStorage in plaintext.
 */

const KEY_MATERIAL_LS_KEY = 'legeon_vault_key_v1';
const ALGORITHM = 'AES-GCM';
const KEY_LENGTH = 256;
const IV_LENGTH = 12; // 96-bit IV required for AES-GCM

// ---------------------------------------------------------------------------
// Low-level crypto helpers (exported for unit tests)
// ---------------------------------------------------------------------------

/** Generate a fresh AES-GCM CryptoKey (not persisted). */
export async function generateCryptoKey(): Promise<CryptoKey> {
  return crypto.subtle.generateKey(
    { name: ALGORITHM, length: KEY_LENGTH },
    true, // extractable so we can persist the raw key material
    ['encrypt', 'decrypt'],
  );
}

/** Encrypt arbitrary JSON-serialisable data. Returns IV + ciphertext. */
export async function encryptData(data: unknown, key: CryptoKey): Promise<ArrayBuffer> {
  const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));
  const encoded = new TextEncoder().encode(JSON.stringify(data));

  const ciphertext = await crypto.subtle.encrypt({ name: ALGORITHM, iv }, key, encoded);

  // Prepend IV so we can recover it during decryption.
  const result = new Uint8Array(IV_LENGTH + ciphertext.byteLength);
  result.set(iv, 0);
  result.set(new Uint8Array(ciphertext), IV_LENGTH);
  return result.buffer;
}

/** Decrypt a buffer produced by encryptData. Returns the original value. */
export async function decryptData(buffer: ArrayBuffer, key: CryptoKey): Promise<unknown> {
  const bytes = new Uint8Array(buffer);
  const iv = bytes.slice(0, IV_LENGTH);
  const ciphertext = bytes.slice(IV_LENGTH);

  const plaintext = await crypto.subtle.decrypt({ name: ALGORITHM, iv }, key, ciphertext);
  return JSON.parse(new TextDecoder().decode(plaintext));
}

// ---------------------------------------------------------------------------
// Base64 helpers
// ---------------------------------------------------------------------------

export function bufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export function base64ToBuffer(base64: string): ArrayBuffer {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

// ---------------------------------------------------------------------------
// Device-local key management
// ---------------------------------------------------------------------------

/**
 * Return the device-local AES-GCM key, creating and persisting it on first
 * call. Reads/writes raw key material from/to localStorage.
 *
 * This is intentionally prototype-grade: the "device key" in localStorage
 * protects against casual inspection of the IndexedDB blob but does not
 * provide strong security against an attacker who has access to both stores.
 */
export async function getOrCreateDeviceKey(): Promise<CryptoKey> {
  const stored = localStorage.getItem(KEY_MATERIAL_LS_KEY);

  if (stored) {
    try {
      const rawKey = base64ToBuffer(stored);
      return await crypto.subtle.importKey(
        'raw',
        rawKey,
        { name: ALGORITHM },
        false,
        ['encrypt', 'decrypt'],
      );
    } catch {
      // Key material is corrupt — discard and regenerate.
      localStorage.removeItem(KEY_MATERIAL_LS_KEY);
    }
  }

  const key = await generateCryptoKey();
  const rawKey = await crypto.subtle.exportKey('raw', key);
  localStorage.setItem(KEY_MATERIAL_LS_KEY, bufferToBase64(rawKey));
  return key;
}

/** Remove the device key from localStorage (used during vault.reset()). */
export function clearDeviceKey(): void {
  localStorage.removeItem(KEY_MATERIAL_LS_KEY);
}
