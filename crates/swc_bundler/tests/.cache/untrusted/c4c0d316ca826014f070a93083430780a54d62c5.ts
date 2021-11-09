// Loaded from https://raw.githubusercontent.com/aricart/tweetnacl-deno/import-type-fixes/src/box.ts


import { ByteArray } from './array.ts';
import { _0 } from './core.ts';
import { randomBytes } from './random.ts';
import { _hsalsa20, _sigma } from './salsa20.ts';
import { _scalarMult, _scalarMult_base } from './scalarmult.ts';
import { secretbox, secretbox_open, SecretBoxLength } from './secretbox.ts';
import { checkArrayTypes, checkBoxLengths } from './check.ts';

export const enum BoxLength {
    PublicKey = 32, // public key bytes
    SecretKey = 32, // secret key bytes
    SharedKey = 32, // before nm bytes
    Nonce = SecretBoxLength.Nonce, // nonce bytes
    Overhead = SecretBoxLength.Overhead, // zero bytes
}

export interface BoxKeyPair {
    publicKey: ByteArray;
    secretKey: ByteArray;
}

export function box(msg: ByteArray, nonce: ByteArray, publicKey: ByteArray, secretKey: ByteArray): ByteArray {
    const k = box_before(publicKey, secretKey);

    return secretbox(msg, nonce, k);
}

export function box_before(publicKey: ByteArray, secretKey: ByteArray): ByteArray {
    checkArrayTypes(publicKey, secretKey);
    checkBoxLengths(publicKey, secretKey);

    const k = ByteArray(BoxLength.SharedKey);

    _box_beforenm(k, publicKey, secretKey);

    return k;
}

export const box_after: (msg: ByteArray, nonce: ByteArray, key: ByteArray) => ByteArray = secretbox;

export function box_open(msg: ByteArray, nonce: ByteArray, publicKey: ByteArray, secretKey: ByteArray): ByteArray | undefined {
    const k = box_before(publicKey, secretKey);

    return secretbox_open(msg, nonce, k);
}

export const box_open_after: (box: ByteArray, nonce: ByteArray, key: ByteArray) => ByteArray | undefined = secretbox_open;

export function box_keyPair(): BoxKeyPair {
    const pk = ByteArray(BoxLength.PublicKey);
    const sk = ByteArray(BoxLength.SecretKey);

    _box_keypair(pk, sk);

    return { publicKey: pk, secretKey: sk };
}

export function box_keyPair_fromSecretKey(secretKey: ByteArray): BoxKeyPair {
    checkArrayTypes(secretKey);

    if (secretKey.length !== BoxLength.SecretKey)
        throw new Error(`bad secret key size (${secretKey.length}), should be ${BoxLength.SecretKey}`);

    const pk = ByteArray(BoxLength.PublicKey);

    _scalarMult_base(pk, secretKey);

    return { publicKey: pk, secretKey: ByteArray(secretKey) };
}

// low level
function _box_keypair(y: ByteArray, x: ByteArray) {
    x.set(randomBytes(32));

    return _scalarMult_base(y, x);
}

function _box_beforenm(k: ByteArray, y: ByteArray, x: ByteArray) {
    const s = ByteArray(32);

    _scalarMult(s, x, y);

    return _hsalsa20(k, _0, s, _sigma);
}
