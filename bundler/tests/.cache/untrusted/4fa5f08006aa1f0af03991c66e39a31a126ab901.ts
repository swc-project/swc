// Loaded from https://raw.githubusercontent.com/aricart/tweetnacl-deno/import-type-fixes/src/verify.ts


import type { ByteArray } from './array.ts';
import { checkArrayTypes } from './check.ts';

function vn(x: ByteArray, xi: number, y: ByteArray, yi: number, n: number): number {
    let i, d = 0;

    for (i = 0; i < n; i++) d |= x[xi + i] ^ y[yi + i];

    return (1 & ((d - 1) >>> 8)) - 1;
}

export function _verify_16(x: ByteArray, xi: number, y: ByteArray, yi: number): number {
    return vn(x, xi, y, yi, 16);
}

export function _verify_32(x: ByteArray, xi: number, y: ByteArray, yi: number): number {
    return vn(x, xi, y, yi, 32);
}

export function verify(x: ByteArray, y: ByteArray): boolean {
    checkArrayTypes(x, y);

    // Zero length arguments are considered not equal
    return x.length > 0 && y.length > 0 &&
        x.length == y.length &&
        vn(x, 0, y, 0, x.length) == 0;
}
