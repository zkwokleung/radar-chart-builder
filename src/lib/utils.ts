import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

type BufferCtor = {
  from(input: string, encoding?: string): {
    toString: (encoding?: string) => string;
  };
};

function getBuffer() {
  if (typeof globalThis === 'undefined') {
    return undefined;
  }
  return (globalThis as { Buffer?: BufferCtor }).Buffer;
}

function toBinaryString(value: string) {
  return encodeURIComponent(value).replace(/%([0-9A-F]{2})/g, (_, hex) =>
    String.fromCharCode(Number.parseInt(hex, 16)),
  );
}

function fromBinaryString(value: string) {
  return decodeURIComponent(
    Array.from(value)
      .map((char) => `%${char.charCodeAt(0).toString(16).padStart(2, '0')}`)
      .join(''),
  );
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function encodeToBase64(value: string) {
  if (typeof window !== 'undefined' && typeof window.btoa === 'function') {
    return window.btoa(toBinaryString(value));
  }

  const bufferCtor = getBuffer();
  if (bufferCtor) {
    return bufferCtor.from(value, 'utf-8').toString('base64');
  }

  throw new Error('Base64 encoding is not supported in this environment.');
}

export function decodeFromBase64(value: string) {
  if (typeof window !== 'undefined' && typeof window.atob === 'function') {
    return fromBinaryString(window.atob(value));
  }

  const bufferCtor = getBuffer();
  if (bufferCtor) {
    return bufferCtor.from(value, 'base64').toString('utf-8');
  }

  throw new Error('Base64 decoding is not supported in this environment.');
}
