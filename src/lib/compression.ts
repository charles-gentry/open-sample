import pako from 'pako';

function toBase64Url(bytes: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromBase64Url(str: string): Uint8Array {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) base64 += '=';
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

export function compress(data: string): string {
  const bytes = pako.deflate(new TextEncoder().encode(data));
  return toBase64Url(bytes);
}

export function decompress(encoded: string): string {
  const bytes = fromBase64Url(encoded);
  const inflated = pako.inflate(bytes);
  return new TextDecoder().decode(inflated);
}
