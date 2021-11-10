// Loaded from https://deno.land/x/god_crypto@v1.4.3/src/rsa/rsa_internal.ts


import { power_mod } from "./../math.ts";
import { eme_oaep_encode, eme_oaep_decode } from "./eme_oaep.ts";
import { os2ip, i2osp } from "./primitives.ts";
import { concat, random_bytes } from "./../helper.ts";
import { ber_decode, ber_simple } from "./basic_encoding_rule.ts";
import { RawBinary } from "../binary.ts";

/**
 * @param n public key modulus
 * @param e public key exponent
 * @param m message representative
 */
export function rsaep(n: bigint, e: bigint, m: bigint): bigint {
  return power_mod(m, e, n);
}

/**
 * @param n private key modulus
 * @param d private key exponent
 * @param c ciphertext representative
 */
export function rsadp(n: bigint, d: bigint, c: bigint): bigint {
  return power_mod(c, d, n);
}

export function rsa_oaep_encrypt(
  bytes: number,
  n: bigint,
  e: bigint,
  m: Uint8Array,
  algorithm: "sha1" | "sha256",
) {
  const em = eme_oaep_encode(new Uint8Array(0), m, bytes, algorithm);
  const msg = os2ip(em);
  const c = rsaep(n, e, msg);
  return i2osp(c, bytes);
}

export function rsa_oaep_decrypt(
  bytes: number,
  n: bigint,
  d: bigint,
  c: Uint8Array,
  algorithm: "sha1" | "sha256",
) {
  const em = rsadp(n, d, os2ip(c));
  const m = eme_oaep_decode(
    new Uint8Array(0),
    i2osp(em, bytes),
    bytes,
    algorithm,
  );
  return m;
}

export function rsa_pkcs1_encrypt(
  bytes: number,
  n: bigint,
  e: bigint,
  m: Uint8Array,
) {
  const p = concat([0x00, 0x02], random_bytes(bytes - m.length - 3), [0x00], m);
  const msg = os2ip(p);
  const c = rsaep(n, e, msg);
  return i2osp(c, bytes);
}

export function rsa_pkcs1_decrypt(
  bytes: number,
  n: bigint,
  d: bigint,
  c: Uint8Array,
) {
  const em = i2osp(rsadp(n, d, os2ip(c)), bytes);

  if (em[0] !== 0) throw "Decryption error";
  if (em[1] !== 0x02) throw "Decryption error";

  let psCursor = 2;
  for (; psCursor < em.length; psCursor++) {
    if (em[psCursor] === 0x00) break;
  }

  if (psCursor < 10) throw "Decryption error";

  return em.slice(psCursor + 1);
}

export function rsa_pkcs1_verify(
  bytes: number,
  n: bigint,
  d: bigint,
  s: Uint8Array,
  m: Uint8Array,
): boolean {
  let em = i2osp(rsadp(n, d, os2ip(s)), bytes);

  if (em[0] !== 0) throw "Decryption error";
  if (em[1] !== 0x01) throw "Decryption error";

  let psCursor = 2;
  for (; psCursor < em.length; psCursor++) {
    if (em[psCursor] === 0x00) break;
  }

  if (psCursor < 10) throw "Decryption error";

  // Removing padding
  em = em.slice(psCursor + 1);

  // Parsing the BER
  const ber: [[number, null], Uint8Array] = ber_simple(ber_decode(em)) as any;
  const decryptedMessage = ber[1];

  // Comparing the value
  if (decryptedMessage.length !== m.length) return false;
  for (let i = 0; i < decryptedMessage.length; i++) {
    if (decryptedMessage[i] !== m[i]) return false;
  }

  return true;
}

export function rsa_pkcs1_sign(
  bytes: number,
  n: bigint,
  d: bigint,
  message: Uint8Array,
): RawBinary {
  // deno-fmt-ignore
  const oid = [0x30, 0x0d, 0x06, 0x09, 0x60, 0x86, 0x48, 0x01, 0x65, 0x03, 0x04, 0x02, 0x01, 0x05, 0x00]
  const der = [
    0x30,
    message.length + 2 + oid.length,
    ...oid,
    0x04,
    message.length,
    ...message,
  ];

  const ps = new Array(bytes - 3 - der.length).fill(0xff);
  const em = new Uint8Array([0x00, 0x01, ...ps, 0x00, ...der]);

  const msg = os2ip(em);
  const c = rsaep(n, d, msg);
  return new RawBinary(i2osp(c, bytes));
}
