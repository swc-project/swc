// Loaded from https://deno.land/x/god_crypto@v1.4.3/src/helper.ts


export function str2bytes(str: string): Uint8Array {
  const encoder = new TextEncoder();
  return encoder.encode(str);
}

export function hex(bytes: Uint8Array): string {
  let output = "";
  for (const b of bytes) output += b.toString(16).padStart(2, "0");
  return output;
}

export function xor(a: Uint8Array, b: Uint8Array) {
  const c = new Uint8Array(a.length);
  for (let i = 0; i < c.length; i++) {
    c[i] = a[i] ^ b[i % b.length];
  }
  return c;
}

export function concat(...arg: (Uint8Array | number[])[]) {
  const length = arg.reduce((a, b) => a + b.length, 0);
  const c = new Uint8Array(length);
  let ptr = 0;
  for (let i = 0; i < arg.length; i++) {
    c.set(arg[i], ptr);
    ptr += arg[i].length;
  }

  return c;
}

export function bignum_to_byte(n: bigint): number[] {
  const bytes = [];
  while (n > 0) {
    bytes.push(Number(n & 255n));
    n = n >> 8n;
  }

  bytes.reverse();
  return bytes;
}

export function random_bytes(length: number): Uint8Array {
  const n = new Uint8Array(length);
  for (let i = 0; i < length; i++) n[i] = ((Math.random() * 254) | 0) + 1;
  return n;
}

export function get_key_size(n: bigint): number {
  const size_list = [64n, 128n, 256n, 512n, 1024n];

  for (const size of size_list) {
    if (n < (1n << size * 8n)) return Number(size);
  }

  return 2048;
}

export function base64_to_binary(b: string): Uint8Array {
  let binaryString = window.atob(b);
  let len = binaryString.length;
  let bytes = new Uint8Array(len);

  for (var i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  return bytes;
}
