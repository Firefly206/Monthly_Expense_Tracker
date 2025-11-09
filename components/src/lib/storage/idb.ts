import { openDB } from "idb";

const DB_NAME = "budget_local";
const STORE = "sqlite_bytes";
const KEY = "budget.db";

export async function loadBytes(): Promise<Uint8Array | null> {
  const db = await openDB(DB_NAME, 1, {
    upgrade(d) {
      d.createObjectStore(STORE);
    },
  });
  const buf = await db.get(STORE, KEY);
  return buf ? new Uint8Array(buf as ArrayBuffer) : null;
}

export async function saveBytes(bytes: Uint8Array): Promise<void> {
  const db = await openDB(DB_NAME, 1, {
    upgrade(d) {
      d.createObjectStore(STORE);
    },
  });
  await db.put(STORE, bytes, KEY);
}
