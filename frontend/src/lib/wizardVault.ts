/**
 * wizardVault — Encrypted persistence for WizardState.
 *
 * Reuses the same WebCrypto (AES-GCM) infrastructure as onboardingVault
 * but uses separate IndexedDB record key and localStorage key so the two
 * vaults never collide.
 *
 * Storage layout (shared IDB database, shared object store):
 *   IDB record key : 'wizard_state'
 *   localStorage   : 'legeon_wizard_fallback_v1'
 *
 * Write order (matching onboardingVault for reliability):
 *   encrypt → localStorage.setItem (synchronous) → IDB.put (async)
 */

import {
  getOrCreateDeviceKey,
  encryptData,
  decryptData,
  bufferToBase64,
  base64ToBuffer,
} from './vault/cryptoUtils'
import type { WizardState } from './types'

// ---------------------------------------------------------------------------
// Constants — intentionally different from onboardingVault constants
// ---------------------------------------------------------------------------

const DB_NAME = 'legeon_vault_db'       // shared DB
const STORE_NAME = 'vault'              // shared object store
const WIZARD_RECORD_KEY = 'wizard_state'
const LS_WIZARD_KEY = 'legeon_wizard_fallback_v1'

// ---------------------------------------------------------------------------
// IndexedDB helpers (inline — avoids coupling to indexedDbStorage.ts constants)
// ---------------------------------------------------------------------------

function openWizardDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1)
    req.onupgradeneeded = () => {
      if (!req.result.objectStoreNames.contains(STORE_NAME)) {
        req.result.createObjectStore(STORE_NAME, { keyPath: 'key' })
      }
    }
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

async function writeWizardToIDB(data: ArrayBuffer): Promise<void> {
  const db = await openWizardDB()
  const tx = db.transaction(STORE_NAME, 'readwrite')
  tx.objectStore(STORE_NAME).put({ key: WIZARD_RECORD_KEY, data })
  return new Promise<void>((resolve, reject) => {
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
}

async function readWizardFromIDB(): Promise<ArrayBuffer | null> {
  try {
    const db = await openWizardDB()
    const tx = db.transaction(STORE_NAME, 'readonly')
    return new Promise<ArrayBuffer | null>((resolve, reject) => {
      const req = tx.objectStore(STORE_NAME).get(WIZARD_RECORD_KEY)
      req.onsuccess = () => resolve((req.result?.data as ArrayBuffer) ?? null)
      req.onerror = () => reject(req.error)
    })
  } catch {
    return null
  }
}

async function deleteWizardFromIDB(): Promise<void> {
  try {
    const db = await openWizardDB()
    const tx = db.transaction(STORE_NAME, 'readwrite')
    tx.objectStore(STORE_NAME).delete(WIZARD_RECORD_KEY)
    return new Promise<void>((resolve) => {
      tx.oncomplete = () => resolve()
      tx.onerror = () => resolve() // silently ignore on reset
    })
  } catch {
    // ignore
  }
}

// ---------------------------------------------------------------------------
// Encrypt / decrypt helpers
// ---------------------------------------------------------------------------

async function writeEncrypted(state: WizardState): Promise<void> {
  const key = await getOrCreateDeviceKey()
  const encrypted = await encryptData(state, key)
  // Always mirror to localStorage immediately after encryption (synchronous)
  localStorage.setItem(LS_WIZARD_KEY, bufferToBase64(encrypted))
  try {
    await writeWizardToIDB(encrypted)
  } catch {
    // localStorage already updated above — IDB failure is non-fatal
  }
}

async function readEncrypted(): Promise<unknown | null> {
  // 1. Try IndexedDB first
  try {
    const data = await readWizardFromIDB()
    if (data) {
      const key = await getOrCreateDeviceKey()
      return await decryptData(data, key)
    }
  } catch {
    // fall through to localStorage fallback
  }

  // 2. Fallback to localStorage (populated on every save)
  try {
    const b64 = localStorage.getItem(LS_WIZARD_KEY)
    if (!b64) return null
    const key = await getOrCreateDeviceKey()
    return await decryptData(base64ToBuffer(b64), key)
  } catch {
    return null
  }
}

// ---------------------------------------------------------------------------
// Public vault interface
// ---------------------------------------------------------------------------

export const wizardVault = {
  async save(state: WizardState): Promise<void> {
    await writeEncrypted(state)
  },

  async load(): Promise<WizardState | null> {
    const data = await readEncrypted()
    if (!data) return null
    return data as WizardState
  },

  async reset(): Promise<void> {
    localStorage.removeItem(LS_WIZARD_KEY)
    await deleteWizardFromIDB()
  },
}
