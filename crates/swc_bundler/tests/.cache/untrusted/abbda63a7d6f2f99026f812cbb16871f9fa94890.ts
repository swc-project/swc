// Loaded from https://raw.githubusercontent.com/aricart/tweetnacl-deno/import-type-fixes/src/auth.ts


import { ByteArray } from './array.ts';
import { hash } from './hash.ts';

export const enum AuthLength {
    Auth = 32,
    AuthFull = 64,
    Key = 32,
}

export function auth(msg: ByteArray, key: ByteArray) {
    const out = ByteArray(32);

    out.set(hmac(msg, key).subarray(0, 32));

    return out;
}

const BLOCK_SIZE = 128;
const HASH_SIZE = 64;

function hmac(msg: ByteArray, key: ByteArray): ByteArray {
    const buf = ByteArray(BLOCK_SIZE + Math.max(HASH_SIZE, msg.length));
    let i, innerHash;

    if (key.length > BLOCK_SIZE) key = hash(key);

    for (i = 0; i < BLOCK_SIZE; i++) buf[i] = 0x36;
    for (i = 0; i < key.length; i++) buf[i] ^= key[i];

    buf.set(msg, BLOCK_SIZE);
    innerHash = hash(buf.subarray(0, BLOCK_SIZE + msg.length));

    for (i = 0; i < BLOCK_SIZE; i++) buf[i] = 0x5c;
    for (i = 0; i < key.length; i++) buf[i] ^= key[i];

    buf.set(innerHash, BLOCK_SIZE);
    return hash(buf.subarray(0, BLOCK_SIZE + innerHash.length));
}

export const auth_full: (message: ByteArray, key: ByteArray) => ByteArray = hmac;
