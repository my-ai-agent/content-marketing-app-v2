// lib/imageStorage.ts
import { openDB } from 'idb';

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

// IndexedDB setup - only in browser
const dbPromise = isBrowser ? openDB('tourism-crop-app', 1, {
  upgrade(db) {
    db.createObjectStore('images');
  },
}) : null;

// Save a Blob image under a key
export async function saveImageBlob(key: string, blob: Blob) {
  if (!isBrowser || !dbPromise) {
    console.warn('IndexedDB not available');
    return;
  }
  const db = await dbPromise;
  await db.put('images', blob, key);
}

// Retrieve a Blob image by key
export async function getImageBlob(key: string): Promise<Blob | undefined> {
  if (!isBrowser || !dbPromise) {
    console.warn('IndexedDB not available');
    return undefined;
  }
  const db = await dbPromise;
  return db.get('images', key);
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
