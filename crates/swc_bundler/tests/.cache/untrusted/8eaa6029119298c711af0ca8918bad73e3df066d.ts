// Loaded from https://raw.githubusercontent.com/aricart/tweetnacl-deno/import-type-fixes/src/scalarmult.ts


import { ByteArray, NumArray } from './array.ts';
import { gf, _9, _121665, A, Z, M, S } from './core.ts';
import { sel25519, inv25519, pack25519, unpack25519 } from './curve25519.ts';
import { checkArrayTypes } from './check.ts';

export const enum ScalarLength {
    Scalar = 32, // scalar bytes
    GroupElement = 32, // bytes
}

export function scalarMult(n: ByteArray, p: ByteArray) {
    checkArrayTypes(n, p);

    if (n.length !== ScalarLength.Scalar) throw new Error('bad n size');
    if (p.length !== ScalarLength.GroupElement) throw new Error('bad p size');

    const q = ByteArray(ScalarLength.GroupElement);

    _scalarMult(q, n, p);

    return q;
}

export function scalarMult_base(n: ByteArray) {
    checkArrayTypes(n);

    if (n.length !== ScalarLength.Scalar) throw new Error('bad n size');

    const q = ByteArray(ScalarLength.GroupElement);

    _scalarMult_base(q, n);

    return q;
}

// low level

export function _scalarMult(q: ByteArray, n: ByteArray, p: ByteArray): 0 {
    const z: ByteArray = ByteArray(32);
    const x: NumArray = NumArray(80);
    const a: NumArray = gf();
    const b: NumArray = gf();
    const c: NumArray = gf();
    const d: NumArray = gf();
    const e: NumArray = gf();
    const f: NumArray = gf();

    let r, i;

    for (i = 0; i < 31; i++) z[i] = n[i];

    z[31] = (n[31] & 127) | 64;
    z[0] &= 248;

    unpack25519(x, p);

    for (i = 0; i < 16; i++) {
        b[i] = x[i];
        d[i] = a[i] = c[i] = 0;
    }

    a[0] = d[0] = 1;

    for (i = 254; i >= 0; --i) {
        r = (z[i >>> 3] >>> (i & 7)) & 1;
        sel25519(a, b, r);
        sel25519(c, d, r);
        A(e, a, c);
        Z(a, a, c);
        A(c, b, d);
        Z(b, b, d);
        S(d, e);
        S(f, a);
        M(a, c, a);
        M(c, b, e);
        A(e, a, c);
        Z(a, a, c);
        S(b, a);
        Z(c, d, f);
        M(a, c, _121665);
        A(a, a, d);
        M(c, c, a);
        M(a, d, f);
        M(d, b, x);
        S(b, e);
        sel25519(a, b, r);
        sel25519(c, d, r);
    }

    for (i = 0; i < 16; i++) {
        x[i + 16] = a[i];
        x[i + 32] = c[i];
        x[i + 48] = b[i];
        x[i + 64] = d[i];
    }

    const x32 = x.subarray(32);
    const x16 = x.subarray(16);

    inv25519(x32, x32);
    M(x16, x16, x32);
    pack25519(q, x16);

    return 0;
}

export function _scalarMult_base(q: ByteArray, n: ByteArray): 0 {
    return _scalarMult(q, n, _9);
}
