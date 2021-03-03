// Loaded from https://raw.githubusercontent.com/aricart/tweetnacl-deno/import-type-fixes/src/check.ts


import type { ByteArray } from './array.ts';
import { SecretBoxLength } from './secretbox.ts';
import { BoxLength } from './box.ts';

export function checkLengths(k: ByteArray, n: ByteArray) {
    if (k.length != SecretBoxLength.Key) throw new Error('bad key size');
    if (n.length != SecretBoxLength.Nonce) throw new Error('bad nonce size');
}

export function checkBoxLengths(pk: ByteArray, sk: ByteArray) {
    if (pk.length != BoxLength.PublicKey) throw new Error('bad public key size');
    if (sk.length != BoxLength.SecretKey) throw new Error('bad secret key size');
}

export function checkArrayTypes(...arrays: ByteArray[]) {
    for (const array of arrays) {
        if (!(array instanceof Uint8Array)) {
            throw new TypeError('unexpected type, use ByteArray');
        }
    }
}
