// Loaded from https://raw.githubusercontent.com/aricart/tweetnacl-deno/import-type-fixes/src/server/convert.ts


import type { ByteArray } from '../array.ts';
import { validateBase64, validateHex } from '../validate.ts';
import * as base64 from "https://denopkg.com/chiefbiiko/base64/mod.ts";
import { encodeToString, decodeString } from "https://deno.land/std@0.52.0/encoding/hex.ts";

//const { prototype: { slice } } = Array;

const encoder = new TextEncoder();
const decoder = new TextDecoder();

export function encodeUTF8(a: ByteArray): string {
    return decoder.decode(a);
}

export function decodeUTF8(s: string): ByteArray {
    return encoder.encode(s);
}

export function encodeBase64(a: ByteArray): string {
    return base64.fromUint8Array(a);
}

export function decodeBase64(s: string): ByteArray {
    validateBase64(s);
    return base64.toUint8Array(s);
}

export function encodeHex(a: ByteArray): string {
    return encodeToString(a);
}

export function decodeHex(s: string): ByteArray {
    validateHex(s);
    return decodeString(s);
}
