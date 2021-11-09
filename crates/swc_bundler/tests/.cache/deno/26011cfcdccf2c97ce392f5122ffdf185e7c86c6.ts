// Loaded from https://deno.land/x/mysql/src/util.ts


export function xor(a: Uint8Array, b: Uint8Array): Uint8Array {
  return a.map((byte, index) => {
    return byte ^ b[index];
  });
}
