// Loaded from https://deno.land/x/god_crypto@v0.2.0/src/primitives.ts


import { createHash } from "https://deno.land/std/hash/mod.ts";

type HashFunction = (b: Uint8Array) => Uint8Array;
type HashAlgorithm = "sha1" | "sha256";

/**
 * I2OSP converts a nonnegative integer to an octet string of a specified length.
 * @param x nonnegative integer to be converted
 * @param length intended length of the resulting octet string
 */
export function i2osp(x: bigint, length: number): Uint8Array {
  const t = new Uint8Array(length);
  for(let i = length - 1; i >= 0; i--) {
    if (x === 0n) break;
    t[i] = Number(x & 255n);
    x = x >> 8n;
  }

  return t;
}

export function os2ip(m: Uint8Array): bigint {
  let n = 0n;
  for(const c of m) n = (n << 8n) + BigInt(c);
  return n;
}

/**
 * MGF1 is a Mask Generation Function based on a hash function.
 * https://tools.ietf.org/html/rfc3447#appendix-B.2.1
 * 
 * @param seed seed from which mask is generated, an octet string
 * @param length intended length in octets of the mask
 * @param hash Hash function
 */
export function mgf1(seed: Uint8Array, length: number, hash: HashFunction | HashAlgorithm): Uint8Array {
  let counter = 0n;
  let output: number[] = [];

  while(output.length < length) {
    let h;
    const c = i2osp(counter, 4);

    if (typeof hash === 'function') {
      h = hash(new Uint8Array([...seed, ...c]))
    } else {
      h = new Uint8Array(createHash(hash).update(new Uint8Array([...seed, ...c])).digest());
    }

    output = [...output, ...h];
    counter++;
  }

  return new Uint8Array(output.slice(0, length));
}