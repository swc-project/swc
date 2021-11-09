// Loaded from https://raw.githubusercontent.com/aricart/tweetnacl-deno/import-type-fixes/src/sealedbox.ts


import { ByteArray } from './array.ts';
import { BoxLength, box, box_open, box_keyPair } from './box.ts';
import { Blake2B, blake2b_init, blake2b_update, blake2b_final } from './blake2b.ts';

export const enum SealedBoxLength {
    PublicKey = BoxLength.PublicKey,
    SecretKey = BoxLength.SecretKey,
    Nonce = BoxLength.Nonce,
    Overhead = BoxLength.PublicKey + BoxLength.Overhead,
}

export function sealedbox(m: ByteArray, pk: ByteArray): ByteArray {
    const c = ByteArray(SealedBoxLength.Overhead + m.length);
    const ek = box_keyPair();

    c.set(ek.publicKey);

    const nonce = nonce_gen(ek.publicKey, pk);
    const boxed = box(m, nonce, pk, ek.secretKey);

    c.set(boxed, ek.publicKey.length);

    // clear secret key
    for (let i = 0; i < ek.secretKey.length; i++) ek.secretKey[i] = 0;

    return c;
}

export function sealedbox_open(c: ByteArray, pk: ByteArray, sk: ByteArray): ByteArray | undefined {
    if (c.length < SealedBoxLength.Overhead) return;

    const epk = c.subarray(0, SealedBoxLength.PublicKey);
    const nonce = nonce_gen(epk, pk);
    const boxData = c.subarray(SealedBoxLength.PublicKey);

    return box_open(boxData, nonce, epk, sk);
}

function nonce_gen(pk1: ByteArray, pk2: ByteArray) {
    const state: Blake2B = blake2b_init(SealedBoxLength.Nonce);

    blake2b_update(state, pk1);
    blake2b_update(state, pk2);

    return blake2b_final(state);
}
