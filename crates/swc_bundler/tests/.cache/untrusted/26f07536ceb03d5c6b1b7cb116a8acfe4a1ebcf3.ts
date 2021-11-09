// Loaded from https://raw.githubusercontent.com/aricart/tweetnacl-deno/import-type-fixes/src/poly1305.ts


/*
* Port of Andrew Moon's Poly1305-donna-16. Public domain.
* https://github.com/floodyberry/poly1305-donna
*
* Ported to TypeScript in 2018 by K. <kayo@illumium.org>
*/

import { ByteArray, HalfArray } from './array.ts';

export interface Poly1305 {
    buffer: ByteArray;
    r: HalfArray
    h: HalfArray;
    pad: HalfArray;
    leftover: number;
    fin: number;
}

export function poly1305_init(key: ByteArray): Poly1305 {
    const r = HalfArray(10);
    const pad = HalfArray(8);

    let t0, t1, t2, t3, t4, t5, t6, t7;

    t0 = key[0] & 0xff | (key[1] & 0xff) << 8; r[0] = (t0) & 0x1fff;
    t1 = key[2] & 0xff | (key[3] & 0xff) << 8; r[1] = ((t0 >>> 13) | (t1 << 3)) & 0x1fff;
    t2 = key[4] & 0xff | (key[5] & 0xff) << 8; r[2] = ((t1 >>> 10) | (t2 << 6)) & 0x1f03;
    t3 = key[6] & 0xff | (key[7] & 0xff) << 8; r[3] = ((t2 >>> 7) | (t3 << 9)) & 0x1fff;
    t4 = key[8] & 0xff | (key[9] & 0xff) << 8; r[4] = ((t3 >>> 4) | (t4 << 12)) & 0x00ff;

    r[5] = ((t4 >>> 1)) & 0x1ffe;

    t5 = key[10] & 0xff | (key[11] & 0xff) << 8; r[6] = ((t4 >>> 14) | (t5 << 2)) & 0x1fff;
    t6 = key[12] & 0xff | (key[13] & 0xff) << 8; r[7] = ((t5 >>> 11) | (t6 << 5)) & 0x1f81;
    t7 = key[14] & 0xff | (key[15] & 0xff) << 8; r[8] = ((t6 >>> 8) | (t7 << 8)) & 0x1fff;

    r[9] = ((t7 >>> 5)) & 0x007f;

    pad[0] = key[16] & 0xff | (key[17] & 0xff) << 8;
    pad[1] = key[18] & 0xff | (key[19] & 0xff) << 8;
    pad[2] = key[20] & 0xff | (key[21] & 0xff) << 8;
    pad[3] = key[22] & 0xff | (key[23] & 0xff) << 8;
    pad[4] = key[24] & 0xff | (key[25] & 0xff) << 8;
    pad[5] = key[26] & 0xff | (key[27] & 0xff) << 8;
    pad[6] = key[28] & 0xff | (key[29] & 0xff) << 8;
    pad[7] = key[30] & 0xff | (key[31] & 0xff) << 8;

    return {
        buffer: ByteArray(16),
        r,
        h: HalfArray(10),
        pad,
        leftover: 0,
        fin: 0,
    };
};

export function poly1305_blocks(self: Poly1305, m: ByteArray, mpos: number, bytes: number) {
    const hibit = self.fin ? 0 : (1 << 11);

    let t0, t1, t2, t3, t4, t5, t6, t7, c;
    let d0, d1, d2, d3, d4, d5, d6, d7, d8, d9;

    const { h, r } = self;

    let h0 = h[0],
        h1 = h[1],
        h2 = h[2],
        h3 = h[3],
        h4 = h[4],
        h5 = h[5],
        h6 = h[6],
        h7 = h[7],
        h8 = h[8],
        h9 = h[9];

    const r0 = r[0],
        r1 = r[1],
        r2 = r[2],
        r3 = r[3],
        r4 = r[4],
        r5 = r[5],
        r6 = r[6],
        r7 = r[7],
        r8 = r[8],
        r9 = r[9];

    while (bytes >= 16) {
        t0 = m[mpos + 0] & 0xff | (m[mpos + 1] & 0xff) << 8; h0 += (t0) & 0x1fff;
        t1 = m[mpos + 2] & 0xff | (m[mpos + 3] & 0xff) << 8; h1 += ((t0 >>> 13) | (t1 << 3)) & 0x1fff;
        t2 = m[mpos + 4] & 0xff | (m[mpos + 5] & 0xff) << 8; h2 += ((t1 >>> 10) | (t2 << 6)) & 0x1fff;
        t3 = m[mpos + 6] & 0xff | (m[mpos + 7] & 0xff) << 8; h3 += ((t2 >>> 7) | (t3 << 9)) & 0x1fff;
        t4 = m[mpos + 8] & 0xff | (m[mpos + 9] & 0xff) << 8; h4 += ((t3 >>> 4) | (t4 << 12)) & 0x1fff;
        h5 += ((t4 >>> 1)) & 0x1fff;
        t5 = m[mpos + 10] & 0xff | (m[mpos + 11] & 0xff) << 8; h6 += ((t4 >>> 14) | (t5 << 2)) & 0x1fff;
        t6 = m[mpos + 12] & 0xff | (m[mpos + 13] & 0xff) << 8; h7 += ((t5 >>> 11) | (t6 << 5)) & 0x1fff;
        t7 = m[mpos + 14] & 0xff | (m[mpos + 15] & 0xff) << 8; h8 += ((t6 >>> 8) | (t7 << 8)) & 0x1fff;
        h9 += ((t7 >>> 5)) | hibit;

        c = 0;

        d0 = c;
        d0 += h0 * r0;
        d0 += h1 * (5 * r9);
        d0 += h2 * (5 * r8);
        d0 += h3 * (5 * r7);
        d0 += h4 * (5 * r6);
        c = (d0 >>> 13); d0 &= 0x1fff;
        d0 += h5 * (5 * r5);
        d0 += h6 * (5 * r4);
        d0 += h7 * (5 * r3);
        d0 += h8 * (5 * r2);
        d0 += h9 * (5 * r1);
        c += (d0 >>> 13); d0 &= 0x1fff;

        d1 = c;
        d1 += h0 * r1;
        d1 += h1 * r0;
        d1 += h2 * (5 * r9);
        d1 += h3 * (5 * r8);
        d1 += h4 * (5 * r7);
        c = (d1 >>> 13); d1 &= 0x1fff;
        d1 += h5 * (5 * r6);
        d1 += h6 * (5 * r5);
        d1 += h7 * (5 * r4);
        d1 += h8 * (5 * r3);
        d1 += h9 * (5 * r2);
        c += (d1 >>> 13); d1 &= 0x1fff;

        d2 = c;
        d2 += h0 * r2;
        d2 += h1 * r1;
        d2 += h2 * r0;
        d2 += h3 * (5 * r9);
        d2 += h4 * (5 * r8);
        c = (d2 >>> 13); d2 &= 0x1fff;
        d2 += h5 * (5 * r7);
        d2 += h6 * (5 * r6);
        d2 += h7 * (5 * r5);
        d2 += h8 * (5 * r4);
        d2 += h9 * (5 * r3);
        c += (d2 >>> 13); d2 &= 0x1fff;

        d3 = c;
        d3 += h0 * r3;
        d3 += h1 * r2;
        d3 += h2 * r1;
        d3 += h3 * r0;
        d3 += h4 * (5 * r9);
        c = (d3 >>> 13); d3 &= 0x1fff;
        d3 += h5 * (5 * r8);
        d3 += h6 * (5 * r7);
        d3 += h7 * (5 * r6);
        d3 += h8 * (5 * r5);
        d3 += h9 * (5 * r4);
        c += (d3 >>> 13); d3 &= 0x1fff;

        d4 = c;
        d4 += h0 * r4;
        d4 += h1 * r3;
        d4 += h2 * r2;
        d4 += h3 * r1;
        d4 += h4 * r0;
        c = (d4 >>> 13); d4 &= 0x1fff;
        d4 += h5 * (5 * r9);
        d4 += h6 * (5 * r8);
        d4 += h7 * (5 * r7);
        d4 += h8 * (5 * r6);
        d4 += h9 * (5 * r5);
        c += (d4 >>> 13); d4 &= 0x1fff;

        d5 = c;
        d5 += h0 * r5;
        d5 += h1 * r4;
        d5 += h2 * r3;
        d5 += h3 * r2;
        d5 += h4 * r1;
        c = (d5 >>> 13); d5 &= 0x1fff;
        d5 += h5 * r0;
        d5 += h6 * (5 * r9);
        d5 += h7 * (5 * r8);
        d5 += h8 * (5 * r7);
        d5 += h9 * (5 * r6);
        c += (d5 >>> 13); d5 &= 0x1fff;

        d6 = c;
        d6 += h0 * r6;
        d6 += h1 * r5;
        d6 += h2 * r4;
        d6 += h3 * r3;
        d6 += h4 * r2;
        c = (d6 >>> 13); d6 &= 0x1fff;
        d6 += h5 * r1;
        d6 += h6 * r0;
        d6 += h7 * (5 * r9);
        d6 += h8 * (5 * r8);
        d6 += h9 * (5 * r7);
        c += (d6 >>> 13); d6 &= 0x1fff;

        d7 = c;
        d7 += h0 * r7;
        d7 += h1 * r6;
        d7 += h2 * r5;
        d7 += h3 * r4;
        d7 += h4 * r3;
        c = (d7 >>> 13); d7 &= 0x1fff;
        d7 += h5 * r2;
        d7 += h6 * r1;
        d7 += h7 * r0;
        d7 += h8 * (5 * r9);
        d7 += h9 * (5 * r8);
        c += (d7 >>> 13); d7 &= 0x1fff;

        d8 = c;
        d8 += h0 * r8;
        d8 += h1 * r7;
        d8 += h2 * r6;
        d8 += h3 * r5;
        d8 += h4 * r4;
        c = (d8 >>> 13); d8 &= 0x1fff;
        d8 += h5 * r3;
        d8 += h6 * r2;
        d8 += h7 * r1;
        d8 += h8 * r0;
        d8 += h9 * (5 * r9);
        c += (d8 >>> 13); d8 &= 0x1fff;

        d9 = c;
        d9 += h0 * r9;
        d9 += h1 * r8;
        d9 += h2 * r7;
        d9 += h3 * r6;
        d9 += h4 * r5;
        c = (d9 >>> 13); d9 &= 0x1fff;
        d9 += h5 * r4;
        d9 += h6 * r3;
        d9 += h7 * r2;
        d9 += h8 * r1;
        d9 += h9 * r0;
        c += (d9 >>> 13); d9 &= 0x1fff;

        c = (((c << 2) + c)) | 0;
        c = (c + d0) | 0;
        d0 = c & 0x1fff;
        c = (c >>> 13);
        d1 += c;

        h0 = d0;
        h1 = d1;
        h2 = d2;
        h3 = d3;
        h4 = d4;
        h5 = d5;
        h6 = d6;
        h7 = d7;
        h8 = d8;
        h9 = d9;

        mpos += 16;
        bytes -= 16;
    }

    h[0] = h0;
    h[1] = h1;
    h[2] = h2;
    h[3] = h3;
    h[4] = h4;
    h[5] = h5;
    h[6] = h6;
    h[7] = h7;
    h[8] = h8;
    h[9] = h9;
};

export function poly1305_finish(self: Poly1305, mac: ByteArray, macpos: number) {
    const g = HalfArray(10);
    let c, mask, f, i;

    const { buffer, h, pad, leftover } = self;

    if (leftover) {
        i = leftover;
        buffer[i++] = 1;
        for (; i < 16; i++) buffer[i] = 0;
        self.fin = 1;
        poly1305_blocks(self, buffer, 0, 16);
    }

    c = h[1] >>> 13;
    h[1] &= 0x1fff;

    for (i = 2; i < 10; i++) {
        h[i] += c;
        c = h[i] >>> 13;
        h[i] &= 0x1fff;
    }

    h[0] += (c * 5);

    c = h[0] >>> 13;

    h[0] &= 0x1fff;
    h[1] += c;

    c = h[1] >>> 13;

    h[1] &= 0x1fff;
    h[2] += c;

    g[0] = h[0] + 5;

    c = g[0] >>> 13;

    g[0] &= 0x1fff;

    for (i = 1; i < 10; i++) {
        g[i] = h[i] + c;
        c = g[i] >>> 13;
        g[i] &= 0x1fff;
    }

    g[9] -= (1 << 13);

    mask = (c ^ 1) - 1;

    for (i = 0; i < 10; i++) g[i] &= mask;

    mask = ~mask;

    for (i = 0; i < 10; i++) h[i] = (h[i] & mask) | g[i];

    h[0] = ((h[0]) | (h[1] << 13)) & 0xffff;
    h[1] = ((h[1] >>> 3) | (h[2] << 10)) & 0xffff;
    h[2] = ((h[2] >>> 6) | (h[3] << 7)) & 0xffff;
    h[3] = ((h[3] >>> 9) | (h[4] << 4)) & 0xffff;
    h[4] = ((h[4] >>> 12) | (h[5] << 1) | (h[6] << 14)) & 0xffff;
    h[5] = ((h[6] >>> 2) | (h[7] << 11)) & 0xffff;
    h[6] = ((h[7] >>> 5) | (h[8] << 8)) & 0xffff;
    h[7] = ((h[8] >>> 8) | (h[9] << 5)) & 0xffff;

    f = h[0] + pad[0];

    h[0] = f & 0xffff;

    for (i = 1; i < 8; i++) {
        f = (((h[i] + pad[i]) | 0) + (f >>> 16)) | 0;
        h[i] = f & 0xffff;
    }

    mac[macpos + 0] = (h[0] >>> 0) & 0xff;
    mac[macpos + 1] = (h[0] >>> 8) & 0xff;
    mac[macpos + 2] = (h[1] >>> 0) & 0xff;
    mac[macpos + 3] = (h[1] >>> 8) & 0xff;
    mac[macpos + 4] = (h[2] >>> 0) & 0xff;
    mac[macpos + 5] = (h[2] >>> 8) & 0xff;
    mac[macpos + 6] = (h[3] >>> 0) & 0xff;
    mac[macpos + 7] = (h[3] >>> 8) & 0xff;
    mac[macpos + 8] = (h[4] >>> 0) & 0xff;
    mac[macpos + 9] = (h[4] >>> 8) & 0xff;
    mac[macpos + 10] = (h[5] >>> 0) & 0xff;
    mac[macpos + 11] = (h[5] >>> 8) & 0xff;
    mac[macpos + 12] = (h[6] >>> 0) & 0xff;
    mac[macpos + 13] = (h[6] >>> 8) & 0xff;
    mac[macpos + 14] = (h[7] >>> 0) & 0xff;
    mac[macpos + 15] = (h[7] >>> 8) & 0xff;
};

export function poly1305_update(self: Poly1305, m: ByteArray, mpos: number, bytes: number) {
    let i, want;

    const { buffer } = self;

    if (self.leftover) {
        want = (16 - self.leftover);
        if (want > bytes) want = bytes;

        for (i = 0; i < want; i++) buffer[self.leftover + i] = m[mpos + i];

        bytes -= want;
        mpos += want;
        self.leftover += want;

        if (self.leftover < 16) return;

        poly1305_blocks(self, buffer, 0, 16);

        self.leftover = 0;
    }

    if (bytes >= 16) {
        want = bytes - (bytes % 16);
        poly1305_blocks(self, m, mpos, want);
        mpos += want;
        bytes -= want;
    }

    if (bytes) {
        for (i = 0; i < bytes; i++) buffer[self.leftover + i] = m[mpos + i];
        self.leftover += bytes;
    }
}
