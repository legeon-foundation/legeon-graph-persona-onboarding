/**
 * IndexedDB persistence adapter for the OnboardingVault.
 * Stores a single encrypted ArrayBuffer under a fixed key.
 */

const DB_NAME = 'legeon_vault_db';
const DB_VERSION = 1;
const STORE_NAME = 'vault';
const RECORD_KEY = 'onboarding_state';

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);

    req.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };

    req.onsuccess = (event) => resolve((event.target as IDBOpenDBRequest).result);
    req.onerror = () => reject(req.error);
  });
}

export async function writeToIndexedDB(data: ArrayBuffer): Promise<void> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).put(data, RECORD_KEY);
    tx.oncomplete = () => { db.close(); resolve(); };
    tx.onerror = () => { db.close(); reject(tx.error); };
  });
}

export async function readFromIndexedDB(): Promise<ArrayBuffer | null> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const req = tx.objectStore(STORE_NAME).get(RECORD_KEY);
    req.onsuccess = () => { db.close(); resolve((req.result as ArrayBuffer) ?? null); };
    req.onerror = () => { db.close(); reject(req.error); };
  });
}

export async function deleteFromIndexedDB(): Promise<void> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).delete(RECORD_KEY);
    tx.oncomplete = () => { db.close(); resolve(); };
    tx.onerror = () => { db.close(); reject(tx.error); };
  });
}
