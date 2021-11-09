// Loaded from https://raw.githubusercontent.com/aricart/tweetnacl-deno/import-type-fixes/src/salsa20.ts


import { ByteArray } from './array.ts';

export function _salsa20(o: ByteArray, p: ByteArray, k: ByteArray, c: ByteArray) {
    const
        j0 = c[0] & 0xff | (c[1] & 0xff) << 8 | (c[2] & 0xff) << 16 | (c[3] & 0xff) << 24,
        j1 = k[0] & 0xff | (k[1] & 0xff) << 8 | (k[2] & 0xff) << 16 | (k[3] & 0xff) << 24,
        j2 = k[4] & 0xff | (k[5] & 0xff) << 8 | (k[6] & 0xff) << 16 | (k[7] & 0xff) << 24,
        j3 = k[8] & 0xff | (k[9] & 0xff) << 8 | (k[10] & 0xff) << 16 | (k[11] & 0xff) << 24,
        j4 = k[12] & 0xff | (k[13] & 0xff) << 8 | (k[14] & 0xff) << 16 | (k[15] & 0xff) << 24,
        j5 = c[4] & 0xff | (c[5] & 0xff) << 8 | (c[6] & 0xff) << 16 | (c[7] & 0xff) << 24,
        j6 = p[0] & 0xff | (p[1] & 0xff) << 8 | (p[2] & 0xff) << 16 | (p[3] & 0xff) << 24,
        j7 = p[4] & 0xff | (p[5] & 0xff) << 8 | (p[6] & 0xff) << 16 | (p[7] & 0xff) << 24,
        j8 = p[8] & 0xff | (p[9] & 0xff) << 8 | (p[10] & 0xff) << 16 | (p[11] & 0xff) << 24,
        j9 = p[12] & 0xff | (p[13] & 0xff) << 8 | (p[14] & 0xff) << 16 | (p[15] & 0xff) << 24,
        j10 = c[8] & 0xff | (c[9] & 0xff) << 8 | (c[10] & 0xff) << 16 | (c[11] & 0xff) << 24,
        j11 = k[16] & 0xff | (k[17] & 0xff) << 8 | (k[18] & 0xff) << 16 | (k[19] & 0xff) << 24,
        j12 = k[20] & 0xff | (k[21] & 0xff) << 8 | (k[22] & 0xff) << 16 | (k[23] & 0xff) << 24,
        j13 = k[24] & 0xff | (k[25] & 0xff) << 8 | (k[26] & 0xff) << 16 | (k[27] & 0xff) << 24,
        j14 = k[28] & 0xff | (k[29] & 0xff) << 8 | (k[30] & 0xff) << 16 | (k[31] & 0xff) << 24,
        j15 = c[12] & 0xff | (c[13] & 0xff) << 8 | (c[14] & 0xff) << 16 | (c[15] & 0xff) << 24;

    let x0 = j0, x1 = j1, x2 = j2, x3 = j3, x4 = j4, x5 = j5, x6 = j6, x7 = j7,
        x8 = j8, x9 = j9, x10 = j10, x11 = j11, x12 = j12, x13 = j13, x14 = j14,
        x15 = j15, u;

    for (let i = 0; i < 20; i += 2) {
        u = x0 + x12 | 0;
        x4 ^= u << 7 | u >>> (32 - 7);
        u = x4 + x0 | 0;
        x8 ^= u << 9 | u >>> (32 - 9);
        u = x8 + x4 | 0;
        x12 ^= u << 13 | u >>> (32 - 13);
        u = x12 + x8 | 0;
        x0 ^= u << 18 | u >>> (32 - 18);

        u = x5 + x1 | 0;
        x9 ^= u << 7 | u >>> (32 - 7);
        u = x9 + x5 | 0;
        x13 ^= u << 9 | u >>> (32 - 9);
        u = x13 + x9 | 0;
        x1 ^= u << 13 | u >>> (32 - 13);
        u = x1 + x13 | 0;
        x5 ^= u << 18 | u >>> (32 - 18);

        u = x10 + x6 | 0;
        x14 ^= u << 7 | u >>> (32 - 7);
        u = x14 + x10 | 0;
        x2 ^= u << 9 | u >>> (32 - 9);
        u = x2 + x14 | 0;
        x6 ^= u << 13 | u >>> (32 - 13);
        u = x6 + x2 | 0;
        x10 ^= u << 18 | u >>> (32 - 18);

        u = x15 + x11 | 0;
        x3 ^= u << 7 | u >>> (32 - 7);
        u = x3 + x15 | 0;
        x7 ^= u << 9 | u >>> (32 - 9);
        u = x7 + x3 | 0;
        x11 ^= u << 13 | u >>> (32 - 13);
        u = x11 + x7 | 0;
        x15 ^= u << 18 | u >>> (32 - 18);

        u = x0 + x3 | 0;
        x1 ^= u << 7 | u >>> (32 - 7);
        u = x1 + x0 | 0;
        x2 ^= u << 9 | u >>> (32 - 9);
        u = x2 + x1 | 0;
        x3 ^= u << 13 | u >>> (32 - 13);
        u = x3 + x2 | 0;
        x0 ^= u << 18 | u >>> (32 - 18);

        u = x5 + x4 | 0;
        x6 ^= u << 7 | u >>> (32 - 7);
        u = x6 + x5 | 0;
        x7 ^= u << 9 | u >>> (32 - 9);
        u = x7 + x6 | 0;
        x4 ^= u << 13 | u >>> (32 - 13);
        u = x4 + x7 | 0;
        x5 ^= u << 18 | u >>> (32 - 18);

        u = x10 + x9 | 0;
        x11 ^= u << 7 | u >>> (32 - 7);
        u = x11 + x10 | 0;
        x8 ^= u << 9 | u >>> (32 - 9);
        u = x8 + x11 | 0;
        x9 ^= u << 13 | u >>> (32 - 13);
        u = x9 + x8 | 0;
        x10 ^= u << 18 | u >>> (32 - 18);

        u = x15 + x14 | 0;
        x12 ^= u << 7 | u >>> (32 - 7);
        u = x12 + x15 | 0;
        x13 ^= u << 9 | u >>> (32 - 9);
        u = x13 + x12 | 0;
        x14 ^= u << 13 | u >>> (32 - 13);
        u = x14 + x13 | 0;
        x15 ^= u << 18 | u >>> (32 - 18);
    }

    x0 = x0 + j0 | 0;
    x1 = x1 + j1 | 0;
    x2 = x2 + j2 | 0;
    x3 = x3 + j3 | 0;
    x4 = x4 + j4 | 0;
    x5 = x5 + j5 | 0;
    x6 = x6 + j6 | 0;
    x7 = x7 + j7 | 0;
    x8 = x8 + j8 | 0;
    x9 = x9 + j9 | 0;
    x10 = x10 + j10 | 0;
    x11 = x11 + j11 | 0;
    x12 = x12 + j12 | 0;
    x13 = x13 + j13 | 0;
    x14 = x14 + j14 | 0;
    x15 = x15 + j15 | 0;

    o[0] = x0 >>> 0 & 0xff;
    o[1] = x0 >>> 8 & 0xff;
    o[2] = x0 >>> 16 & 0xff;
    o[3] = x0 >>> 24 & 0xff;

    o[4] = x1 >>> 0 & 0xff;
    o[5] = x1 >>> 8 & 0xff;
    o[6] = x1 >>> 16 & 0xff;
    o[7] = x1 >>> 24 & 0xff;

    o[8] = x2 >>> 0 & 0xff;
    o[9] = x2 >>> 8 & 0xff;
    o[10] = x2 >>> 16 & 0xff;
    o[11] = x2 >>> 24 & 0xff;

    o[12] = x3 >>> 0 & 0xff;
    o[13] = x3 >>> 8 & 0xff;
    o[14] = x3 >>> 16 & 0xff;
    o[15] = x3 >>> 24 & 0xff;

    o[16] = x4 >>> 0 & 0xff;
    o[17] = x4 >>> 8 & 0xff;
    o[18] = x4 >>> 16 & 0xff;
    o[19] = x4 >>> 24 & 0xff;

    o[20] = x5 >>> 0 & 0xff;
    o[21] = x5 >>> 8 & 0xff;
    o[22] = x5 >>> 16 & 0xff;
    o[23] = x5 >>> 24 & 0xff;

    o[24] = x6 >>> 0 & 0xff;
    o[25] = x6 >>> 8 & 0xff;
    o[26] = x6 >>> 16 & 0xff;
    o[27] = x6 >>> 24 & 0xff;

    o[28] = x7 >>> 0 & 0xff;
    o[29] = x7 >>> 8 & 0xff;
    o[30] = x7 >>> 16 & 0xff;
    o[31] = x7 >>> 24 & 0xff;

    o[32] = x8 >>> 0 & 0xff;
    o[33] = x8 >>> 8 & 0xff;
    o[34] = x8 >>> 16 & 0xff;
    o[35] = x8 >>> 24 & 0xff;

    o[36] = x9 >>> 0 & 0xff;
    o[37] = x9 >>> 8 & 0xff;
    o[38] = x9 >>> 16 & 0xff;
    o[39] = x9 >>> 24 & 0xff;

    o[40] = x10 >>> 0 & 0xff;
    o[41] = x10 >>> 8 & 0xff;
    o[42] = x10 >>> 16 & 0xff;
    o[43] = x10 >>> 24 & 0xff;

    o[44] = x11 >>> 0 & 0xff;
    o[45] = x11 >>> 8 & 0xff;
    o[46] = x11 >>> 16 & 0xff;
    o[47] = x11 >>> 24 & 0xff;

    o[48] = x12 >>> 0 & 0xff;
    o[49] = x12 >>> 8 & 0xff;
    o[50] = x12 >>> 16 & 0xff;
    o[51] = x12 >>> 24 & 0xff;

    o[52] = x13 >>> 0 & 0xff;
    o[53] = x13 >>> 8 & 0xff;
    o[54] = x13 >>> 16 & 0xff;
    o[55] = x13 >>> 24 & 0xff;

    o[56] = x14 >>> 0 & 0xff;
    o[57] = x14 >>> 8 & 0xff;
    o[58] = x14 >>> 16 & 0xff;
    o[59] = x14 >>> 24 & 0xff;

    o[60] = x15 >>> 0 & 0xff;
    o[61] = x15 >>> 8 & 0xff;
    o[62] = x15 >>> 16 & 0xff;
    o[63] = x15 >>> 24 & 0xff;
}

export function _hsalsa20(o: ByteArray, p: ByteArray, k: ByteArray, c: ByteArray) {
    const
        j0 = c[0] & 0xff | (c[1] & 0xff) << 8 | (c[2] & 0xff) << 16 | (c[3] & 0xff) << 24,
        j1 = k[0] & 0xff | (k[1] & 0xff) << 8 | (k[2] & 0xff) << 16 | (k[3] & 0xff) << 24,
        j2 = k[4] & 0xff | (k[5] & 0xff) << 8 | (k[6] & 0xff) << 16 | (k[7] & 0xff) << 24,
        j3 = k[8] & 0xff | (k[9] & 0xff) << 8 | (k[10] & 0xff) << 16 | (k[11] & 0xff) << 24,
        j4 = k[12] & 0xff | (k[13] & 0xff) << 8 | (k[14] & 0xff) << 16 | (k[15] & 0xff) << 24,
        j5 = c[4] & 0xff | (c[5] & 0xff) << 8 | (c[6] & 0xff) << 16 | (c[7] & 0xff) << 24,
        j6 = p[0] & 0xff | (p[1] & 0xff) << 8 | (p[2] & 0xff) << 16 | (p[3] & 0xff) << 24,
        j7 = p[4] & 0xff | (p[5] & 0xff) << 8 | (p[6] & 0xff) << 16 | (p[7] & 0xff) << 24,
        j8 = p[8] & 0xff | (p[9] & 0xff) << 8 | (p[10] & 0xff) << 16 | (p[11] & 0xff) << 24,
        j9 = p[12] & 0xff | (p[13] & 0xff) << 8 | (p[14] & 0xff) << 16 | (p[15] & 0xff) << 24,
        j10 = c[8] & 0xff | (c[9] & 0xff) << 8 | (c[10] & 0xff) << 16 | (c[11] & 0xff) << 24,
        j11 = k[16] & 0xff | (k[17] & 0xff) << 8 | (k[18] & 0xff) << 16 | (k[19] & 0xff) << 24,
        j12 = k[20] & 0xff | (k[21] & 0xff) << 8 | (k[22] & 0xff) << 16 | (k[23] & 0xff) << 24,
        j13 = k[24] & 0xff | (k[25] & 0xff) << 8 | (k[26] & 0xff) << 16 | (k[27] & 0xff) << 24,
        j14 = k[28] & 0xff | (k[29] & 0xff) << 8 | (k[30] & 0xff) << 16 | (k[31] & 0xff) << 24,
        j15 = c[12] & 0xff | (c[13] & 0xff) << 8 | (c[14] & 0xff) << 16 | (c[15] & 0xff) << 24;

    let x0 = j0, x1 = j1, x2 = j2, x3 = j3, x4 = j4, x5 = j5, x6 = j6, x7 = j7,
        x8 = j8, x9 = j9, x10 = j10, x11 = j11, x12 = j12, x13 = j13, x14 = j14,
        x15 = j15, u;

    for (let i = 0; i < 20; i += 2) {
        u = x0 + x12 | 0;
        x4 ^= u << 7 | u >>> (32 - 7);
        u = x4 + x0 | 0;
        x8 ^= u << 9 | u >>> (32 - 9);
        u = x8 + x4 | 0;
        x12 ^= u << 13 | u >>> (32 - 13);
        u = x12 + x8 | 0;
        x0 ^= u << 18 | u >>> (32 - 18);

        u = x5 + x1 | 0;
        x9 ^= u << 7 | u >>> (32 - 7);
        u = x9 + x5 | 0;
        x13 ^= u << 9 | u >>> (32 - 9);
        u = x13 + x9 | 0;
        x1 ^= u << 13 | u >>> (32 - 13);
        u = x1 + x13 | 0;
        x5 ^= u << 18 | u >>> (32 - 18);

        u = x10 + x6 | 0;
        x14 ^= u << 7 | u >>> (32 - 7);
        u = x14 + x10 | 0;
        x2 ^= u << 9 | u >>> (32 - 9);
        u = x2 + x14 | 0;
        x6 ^= u << 13 | u >>> (32 - 13);
        u = x6 + x2 | 0;
        x10 ^= u << 18 | u >>> (32 - 18);

        u = x15 + x11 | 0;
        x3 ^= u << 7 | u >>> (32 - 7);
        u = x3 + x15 | 0;
        x7 ^= u << 9 | u >>> (32 - 9);
        u = x7 + x3 | 0;
        x11 ^= u << 13 | u >>> (32 - 13);
        u = x11 + x7 | 0;
        x15 ^= u << 18 | u >>> (32 - 18);

        u = x0 + x3 | 0;
        x1 ^= u << 7 | u >>> (32 - 7);
        u = x1 + x0 | 0;
        x2 ^= u << 9 | u >>> (32 - 9);
        u = x2 + x1 | 0;
        x3 ^= u << 13 | u >>> (32 - 13);
        u = x3 + x2 | 0;
        x0 ^= u << 18 | u >>> (32 - 18);

        u = x5 + x4 | 0;
        x6 ^= u << 7 | u >>> (32 - 7);
        u = x6 + x5 | 0;
        x7 ^= u << 9 | u >>> (32 - 9);
        u = x7 + x6 | 0;
        x4 ^= u << 13 | u >>> (32 - 13);
        u = x4 + x7 | 0;
        x5 ^= u << 18 | u >>> (32 - 18);

        u = x10 + x9 | 0;
        x11 ^= u << 7 | u >>> (32 - 7);
        u = x11 + x10 | 0;
        x8 ^= u << 9 | u >>> (32 - 9);
        u = x8 + x11 | 0;
        x9 ^= u << 13 | u >>> (32 - 13);
        u = x9 + x8 | 0;
        x10 ^= u << 18 | u >>> (32 - 18);

        u = x15 + x14 | 0;
        x12 ^= u << 7 | u >>> (32 - 7);
        u = x12 + x15 | 0;
        x13 ^= u << 9 | u >>> (32 - 9);
        u = x13 + x12 | 0;
        x14 ^= u << 13 | u >>> (32 - 13);
        u = x14 + x13 | 0;
        x15 ^= u << 18 | u >>> (32 - 18);
    }

    o[0] = x0 >>> 0 & 0xff;
    o[1] = x0 >>> 8 & 0xff;
    o[2] = x0 >>> 16 & 0xff;
    o[3] = x0 >>> 24 & 0xff;

    o[4] = x5 >>> 0 & 0xff;
    o[5] = x5 >>> 8 & 0xff;
    o[6] = x5 >>> 16 & 0xff;
    o[7] = x5 >>> 24 & 0xff;

    o[8] = x10 >>> 0 & 0xff;
    o[9] = x10 >>> 8 & 0xff;
    o[10] = x10 >>> 16 & 0xff;
    o[11] = x10 >>> 24 & 0xff;

    o[12] = x15 >>> 0 & 0xff;
    o[13] = x15 >>> 8 & 0xff;
    o[14] = x15 >>> 16 & 0xff;
    o[15] = x15 >>> 24 & 0xff;

    o[16] = x6 >>> 0 & 0xff;
    o[17] = x6 >>> 8 & 0xff;
    o[18] = x6 >>> 16 & 0xff;
    o[19] = x6 >>> 24 & 0xff;

    o[20] = x7 >>> 0 & 0xff;
    o[21] = x7 >>> 8 & 0xff;
    o[22] = x7 >>> 16 & 0xff;
    o[23] = x7 >>> 24 & 0xff;

    o[24] = x8 >>> 0 & 0xff;
    o[25] = x8 >>> 8 & 0xff;
    o[26] = x8 >>> 16 & 0xff;
    o[27] = x8 >>> 24 & 0xff;

    o[28] = x9 >>> 0 & 0xff;
    o[29] = x9 >>> 8 & 0xff;
    o[30] = x9 >>> 16 & 0xff;
    o[31] = x9 >>> 24 & 0xff;
}

export const _sigma: ByteArray = ByteArray([101, 120, 112, 97, 110, 100, 32, 51, 50, 45, 98, 121, 116, 101, 32, 107]);
// "expand 32-byte k"

function _stream_salsa20_xor(c: ByteArray, cpos: number, m: ByteArray, mpos: number, b: number, n: ByteArray, k: ByteArray) {
    const z = ByteArray(16), x = ByteArray(64);
    let u, i;

    for (i = 0; i < 16; i++) z[i] = 0;
    for (i = 0; i < 8; i++) z[i] = n[i];

    while (b >= 64) {
        _salsa20(x, z, k, _sigma);
        for (i = 0; i < 64; i++) c[cpos + i] = m[mpos + i] ^ x[i];
        u = 1;
        for (i = 8; i < 16; i++) {
            u = u + (z[i] & 0xff) | 0;
            z[i] = u & 0xff;
            u >>>= 8;
        }
        b -= 64;
        cpos += 64;
        mpos += 64;
    }

    if (b > 0) {
        _salsa20(x, z, k, _sigma);
        for (i = 0; i < b; i++) c[cpos + i] = m[mpos + i] ^ x[i];
    }

    return 0;
}

function _stream_salsa20(c: ByteArray, cpos: number, b: number, n: ByteArray, k: ByteArray) {
    const z = ByteArray(16), x = ByteArray(64);
    let u, i;
    for (i = 0; i < 16; i++) z[i] = 0;
    for (i = 0; i < 8; i++) z[i] = n[i];
    while (b >= 64) {
        _salsa20(x, z, k, _sigma);
        for (i = 0; i < 64; i++) c[cpos + i] = x[i];
        u = 1;
        for (i = 8; i < 16; i++) {
            u = u + (z[i] & 0xff) | 0;
            z[i] = u & 0xff;
            u >>>= 8;
        }
        b -= 64;
        cpos += 64;
    }
    if (b > 0) {
        _salsa20(x, z, k, _sigma);
        for (i = 0; i < b; i++) c[cpos + i] = x[i];
    }
    return 0;
}

export function _stream(c: ByteArray, cpos: number, d: number, n: ByteArray, k: ByteArray) {
    const s = ByteArray(32), sn = ByteArray(8);

    _hsalsa20(s, n, k, _sigma);

    for (let i = 0; i < 8; i++) sn[i] = n[i + 16];

    return _stream_salsa20(c, cpos, d, sn, s);
}

export function _stream_xor(c: ByteArray, cpos: number, m: ByteArray, mpos: number, d: number, n: ByteArray, k: ByteArray) {
    const s = ByteArray(32), sn = ByteArray(8);

    _hsalsa20(s, n, k, _sigma);

    for (let i = 0; i < 8; i++) sn[i] = n[i + 16];

    return _stream_salsa20_xor(c, cpos, m, mpos, d, sn, s);
}
