import { openDB, type IDBPDatabase } from 'idb';

const isBrowser = typeof window !== 'undefined';

// Helper to check IndexedDB support at runtime (including for private mode)
function isIndexedDBAvailable(): boolean {
  try {
    return isBrowser && !!window.indexedDB;
  } catch {
    return false;
  }
}

// Fallback: simple in-memory cache if IndexedDB/localStorage unavailable
const memoryCache = new Map<string, Blob>();

let dbPromise: Promise<IDBPDatabase<unknown>> | null = null;

if (isIndexedDBAvailable()) {
  dbPromise = openDB('tourism-crop-app', 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('images')) {
        db.createObjectStore('images');
      }
    },
  });
} else {
  dbPromise = null;
}

// Save a Blob image under a key
export async function saveImageBlob(key: string, blob: Blob) {
  if (dbPromise) {
    try {
      const db = await dbPromise;
      await db.put('images', blob, key);
      return;
    } catch (e: any) {
      // Fallback to memoryCache on error
      console.warn('IndexedDB save failed, falling back to memoryCache:', e);
    }
  }
  // Try localStorage as fallback (by base64 encoding)
  try {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (reader.result && typeof reader.result === 'string') {
        localStorage.setItem(`img-${key}`, reader.result);
      }
    };
    reader.readAsDataURL(blob);
  } catch (e) {
    // Fallback to memory only
    memoryCache.set(key, blob);
    console.warn('All storage failed, using memory only:', e);
  }
}

// Retrieve a Blob image by key
export async function getImageBlob(key: string): Promise<Blob | undefined> {
  if (dbPromise) {
    try {
      const db = await dbPromise;
      const blob = await db.get('images', key);
      if (blob) return blob;
    } catch (e) {
      console.warn('IndexedDB get failed:', e);
    }
  }
  // Try localStorage fallback
  try {
    const dataUrl = localStorage.getItem(`img-${key}`);
    if (dataUrl) {
      return dataURLtoBlob(dataUrl);
    }
  } catch (e) {
    // Ignore
  }
  // Fallback to memory cache
  return memoryCache.get(key);
}

// Convert dataURL to Blob
export function dataURLtoBlob(dataurl: string): Blob {
  const arr = dataurl.split(',');
  const mime = arr[0].match(/:(.*?);/)?.[1] || '';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) u8arr[n] = bstr.charCodeAt(n);
  return new Blob([u8arr], { type: mime });
}

// Resize image (by dataURL) to maxDim, return new dataURL
export async function resizeDataUrl(dataUrl: string, maxDim: number): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!isBrowser) {
      reject(new Error('Cannot resize images on server'));
      return;
    }
    const img = new window.Image();
    img.onload = () => {
      let { width, height } = img;
      if (width > maxDim || height > maxDim) {
        if (width > height) {
          height = Math.round((maxDim / width) * height);
          width = maxDim;
        } else {
          width = Math.round((maxDim / height) * width);
          height = maxDim;
        }
      }
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/jpeg', 0.8));
    };
    img.onerror = reject;
    img.src = dataUrl;
  });
}
