// Loaded from https://raw.githubusercontent.com/aricart/tweetnacl-deno/import-type-fixes/src/curve25519.ts


import { ByteArray, NumArray } from './array.ts';
import { _verify_32 } from './verify.ts';
import { gf, S, M } from './core.ts';

export function set25519(r: NumArray, a: NumArray) {
    for (let i = 0; i < 16; i++) r[i] = a[i] | 0;
}

function car25519(o: NumArray) {
    let i, v, c = 1;

    for (i = 0; i < 16; i++) {
        v = o[i] + c + 65535;
        c = Math.floor(v / 65536);
        o[i] = v - c * 65536;
    }

    o[0] += c - 1 + 37 * (c - 1);
}

export function sel25519(p: NumArray, q: NumArray, b: number) {
    let t, c = ~(b - 1);

    for (let i = 0; i < 16; i++) {
        t = c & (p[i] ^ q[i]);
        p[i] ^= t;
        q[i] ^= t;
    }
}

export function pack25519(o: ByteArray, n: NumArray) {
    const m = gf(), t = gf();
    let i, j, b;

    for (i = 0; i < 16; i++) t[i] = n[i];

    car25519(t);
    car25519(t);
    car25519(t);

    for (j = 0; j < 2; j++) {
        m[0] = t[0] - 0xffed;

        for (i = 1; i < 15; i++) {
            m[i] = t[i] - 0xffff - ((m[i - 1] >> 16) & 1);
            m[i - 1] &= 0xffff;
        }

        m[15] = t[15] - 0x7fff - ((m[14] >> 16) & 1);

        b = (m[15] >> 16) & 1;

        m[14] &= 0xffff;

        sel25519(t, m, 1 - b);
    }

    for (i = 0; i < 16; i++) {
        o[2 * i] = t[i] & 0xff;
        o[2 * i + 1] = t[i] >> 8;
    }
}

export function neq25519(a: NumArray, b: NumArray) {
    const c = ByteArray(32), d = ByteArray(32);

    pack25519(c, a);
    pack25519(d, b);

    return _verify_32(c, 0, d, 0);
}

export function par25519(a: NumArray) {
    const d = ByteArray(32);

    pack25519(d, a);

    return d[0] & 1;
}

export function unpack25519(o: NumArray, n: ByteArray) {
    for (let i = 0; i < 16; i++) o[i] = n[2 * i] + (n[2 * i + 1] << 8);

    o[15] &= 0x7fff;
}

export function inv25519(o: NumArray, i: NumArray) {
    const c = gf();
    let a;

    for (a = 0; a < 16; a++) c[a] = i[a];

    for (a = 253; a >= 0; a--) {
        S(c, c);

        if (a !== 2 && a !== 4) M(c, c, i);
    }

    for (a = 0; a < 16; a++) o[a] = c[a];
}
