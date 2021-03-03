// Loaded from https://deno.land/x/god_crypto@v0.2.0/src/eme_oaep.ts


import { createHash } from "https://deno.land/std/hash/mod.ts";
import { mgf1 } from "./primitives.ts";
import { concat, xor, random_bytes } from "./helper.ts";

/**
 * https://tools.ietf.org/html/rfc3447#page-10
 * 
 * @param label 
 * @param m 
 * @param k 
 * @param algorithm 
 */
export function eme_oaep_encode(label: Uint8Array, m: Uint8Array, k: number, algorithm: "sha1" | "sha256"): Uint8Array {
  const labelHash = new Uint8Array(createHash(algorithm).update(label).digest());

  const ps = new Uint8Array(k - labelHash.length * 2 - 2 - m.length);
  const db = concat(labelHash, ps, [0x01], m);
  const seed = random_bytes(labelHash.length);
  const dbMask = mgf1(seed, k - labelHash.length - 1, algorithm);
  const maskedDb = xor(db, dbMask);
  const seedMask = mgf1(maskedDb, labelHash.length, algorithm);
  const maskedSeed = xor(seed, seedMask);

  return concat([0x00], maskedSeed, maskedDb);
}

export function eme_oaep_decode(label: Uint8Array, c: Uint8Array, k: number, algorithm: "sha1" | "sha256"): Uint8Array {
  const labelHash = new Uint8Array(createHash(algorithm).update(label).digest());
  const maskedSeed  = c.slice(1, 1 + labelHash.length);
  const maskedDb = c.slice(1 + labelHash.length);
  const seedMask = mgf1(maskedDb, labelHash.length, algorithm);
  const seed = xor(maskedSeed, seedMask);
  const dbMask = mgf1(seed, k - labelHash.length - 1, algorithm);
  const db = xor(maskedDb, dbMask);

  let ptr = labelHash.length;
  while(ptr < db.length && db[ptr] === 0) ptr++;

  return db.slice(ptr + 1);
}