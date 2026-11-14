export interface SavedVideoMeta {
  id: string;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  savedAt: string;
}

const DB_NAME = 'PurbashaBirthdayVideoDB';
const DB_VERSION = 1;
const STORE_NAME = 'recordings';
const META_STORAGE_KEY = 'purbasha_saved_recordings_meta';

function openVideoDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      reject(new Error('IndexedDB unavailable'));
      return;
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || new Error('Failed to open local video DB'));
  });
}

export async function saveVideoToLocalDeviceStorage(
  blob: Blob,
  fileName: string
): Promise<SavedVideoMeta> {
  const meta: SavedVideoMeta = {
    id: `rec_${Date.now()}`,
    fileName,
    mimeType: blob.type || 'video/mp4',
    sizeBytes: blob.size,
    savedAt: new Date().toISOString(),
  };

  // Persist video Blob in IndexedDB so large MP4 files save safely in browser local storage
  try {
    const db = await openVideoDb();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      store.put({ ...meta, blob });
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error || new Error('Failed to write video'));
    });
    db.close();
  } catch {
    // Non-fatal if browser is in strict private mode; direct download below still saves the file
  }

  // Persist metadata list in localStorage
  try {
    const existingRaw = localStorage.getItem(META_STORAGE_KEY);
    const existing: SavedVideoMeta[] = existingRaw ? JSON.parse(existingRaw) : [];
    const updated = [meta, ...existing].slice(0, 5);
    localStorage.setItem(META_STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // Ignore quota errors on metadata
  }

  return meta;
}

export function triggerBrowserVideoDownload(blob: Blob, fileName: string): string {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  window.setTimeout(() => {
    if (link.parentNode) {
      link.parentNode.removeChild(link);
    }
  }, 1500);
  return url;
}
