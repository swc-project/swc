// Loaded from https://raw.githubusercontent.com/aricart/tweetnacl-deno/import-type-fixes/src/secretbox.ts


import { ByteArray } from './array.ts';
import { _verify_16 } from './verify.ts';
import { _stream_xor, _stream } from './salsa20.ts';
import { poly1305_init, poly1305_update, poly1305_finish } from './poly1305.ts';
import { checkArrayTypes, checkLengths } from './check.ts';

export const enum SecretBoxLength {
    Key = 32,      // key bytes
    Nonce = 24,    // nonce bytes
    Overhead = 16, // box zero bytes
    Zero = 32,     // zero bytes
}

export function secretbox(msg: ByteArray, nonce: ByteArray, key: ByteArray): ByteArray {
    checkArrayTypes(msg, nonce, key);
    checkLengths(key, nonce);

    const m = ByteArray(SecretBoxLength.Zero + msg.length);
    const c = ByteArray(m.length);

    for (let i = 0; i < msg.length; i++) m[i + SecretBoxLength.Zero] = msg[i];

    _secretbox(c, m, m.length, nonce, key);

    return c.subarray(SecretBoxLength.Overhead);
}

export function secretbox_open(box: ByteArray, nonce: ByteArray, key: ByteArray): ByteArray | undefined {
    checkArrayTypes(box, nonce, key);
    checkLengths(key, nonce);

    const c = ByteArray(SecretBoxLength.Overhead + box.length);
    const m = ByteArray(c.length);

    for (let i = 0; i < box.length; i++) c[i + SecretBoxLength.Overhead] = box[i];

    if (c.length < SecretBoxLength.Zero || _secretbox_open(m, c, c.length, nonce, key) !== 0) return;

    return m.subarray(SecretBoxLength.Zero);
}

// low level
function _secretbox(c: ByteArray, m: ByteArray, d: number, n: ByteArray, k: ByteArray): -1 | 0 {
    if (d < 32) return -1;

    _stream_xor(c, 0, m, 0, d, n, k);
    _onetimeauth(c, 16, c, 32, d - 32, c);

    for (let i = 0; i < 16; i++) c[i] = 0;

    return 0;
}

function _secretbox_open(m: ByteArray, c: ByteArray, d: number, n: ByteArray, k: ByteArray): -1 | 0 {
    const x = ByteArray(32);

    if (d < 32) return -1;

    _stream(x, 0, 32, n, k);

    if (_onetimeauth_verify(c, 16, c, 32, d - 32, x) !== 0) return -1;

    _stream_xor(m, 0, c, 0, d, n, k);

    for (let i = 0; i < 32; i++) m[i] = 0;

    return 0;
}

export function _onetimeauth(out: ByteArray, outpos: number, m: ByteArray, mpos: number, n: number, k: ByteArray): 0 {
    const s = poly1305_init(k);

    poly1305_update(s, m, mpos, n);
    poly1305_finish(s, out, outpos);

    return 0;
}

function _onetimeauth_verify(h: ByteArray, hpos: number, m: ByteArray, mpos: number, n: number, k: ByteArray): number {
    const x = ByteArray(16);

    _onetimeauth(x, 0, m, mpos, n, k);

    return _verify_16(h, hpos, x, 0);
}
