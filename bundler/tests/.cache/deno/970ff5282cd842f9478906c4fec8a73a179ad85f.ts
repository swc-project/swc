// Loaded from https://deno.land/x/god_crypto@v0.2.0/src/helper.ts


export function str2bytes(str: string): Uint8Array {
  const encoder = new TextEncoder();
  return encoder.encode(str);
}
  
export function hex(bytes: Uint8Array): string {
  let output = "";
  for(const b of bytes) output += b.toString(16).padStart(2, "0");
  return output;
}

export function xor(a: Uint8Array, b: Uint8Array) {
  const c = new Uint8Array(a.length);
  for(let i = 0; i < c.length; i++) {
    c[i] = a[i] ^ b[i % b.length];
  }
  return c;
}

export function concat(...arg: (Uint8Array | number[])[]) {
  const length = arg.reduce((a, b) => a + b.length, 0);
  const c = new Uint8Array(length);
  let ptr = 0;
  for(let i = 0; i < arg.length; i++) {
    c.set(arg[i], ptr);
    ptr += arg[i].length;
  }

  return c;
}

export function random_bytes(length: number): Uint8Array {
  const n = new Uint8Array(length);
  for(let i = 0; i < length; i++) n[i] = ((Math.random() * 254) | 0) + 1;
  return n;
}

export function get_key_size(n: bigint): number {
  const size_list = [64n, 128n, 256n, 512n, 1024n];

  for(const size of size_list) {
    if (n < (1n << size * 8n)) return Number(size);
  }

  return 2048;
}

export function base64_to_binary(b: string): Uint8Array {
  const base64_map = [
    -2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-1,-2,-2,-1,
    -2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,
    -2,-2,-2,-2,-1,-2,-2,-2,-2,-2,-2,-2,-2,-2,
    -2,62,-2,-2,-2,63,52,53,54,55,56,57,58,59,
    60,61,-2,-2,-2,-1,-2,-2,-2,0,1,2,3,4,5,6,
    7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,
    23,24,25,-2,-2,-2,-2,-2,-2,26,27,28,29,30,31,32,
    33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,
    50,51,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,
    -2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,
    -2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,
    -2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,
    -2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,
    -2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,
    -2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,
    -2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2
  ];

  // Remove unneccessary character
  let e = "";
  for (const c of b) {
    const v = base64_map[c.charCodeAt(0)];
    if (v === -2) throw "Invalid";
    if (v >= 0) e += c;
  }

  // Allocate enough bytes to store given base64
  const bytes = new Uint8Array(Math.floor((e.length * 6) / 8));
  let ptr = 0;

  for(let i = 0; i < e.length; i += 4) {
    const remain = e.length - i;
    if (remain >= 4) {
      const v = (base64_map[e.charCodeAt(i)] << 18) +
        (base64_map[e.charCodeAt(i + 1)] << 12) +
        (base64_map[e.charCodeAt(i + 2)] << 6)  +
        base64_map[e.charCodeAt(i + 3)];

      bytes[ptr++] = v >> 16 % 256;
      bytes[ptr++] = v >> 8 % 256;
      bytes[ptr++] = v % 256;
    } else if (remain === 3) {
      const v = (base64_map[e.charCodeAt(i)] << 10) +
        (base64_map[e.charCodeAt(i + 1)] << 4) +
        (base64_map[e.charCodeAt(i + 2)] >> 2);
      
        bytes[ptr++] = v >> 8 % 256;
        bytes[ptr++] = v % 256;
    } else if (remain === 2) {
      bytes[ptr++] = (base64_map[e.charCodeAt(i)] << 2) +
        (base64_map[e.charCodeAt(i + 1)] >> 4);
    }
  }

  return bytes;
}