// Loaded from https://raw.githubusercontent.com/aricart/tweetnacl-deno/import-type-fixes/src/array.ts


export type ByteArray = Uint8Array;

export function ByteArray(n: number | number[] | ArrayBuffer): ByteArray {
    return new Uint8Array(n as number);
}

export type HalfArray = Uint16Array;

export function HalfArray(n: number | number[] | ArrayBuffer): HalfArray {
    return new Uint16Array(n as number);
}

export type WordArray = Uint32Array;

export function WordArray(n: number | number[] | ArrayBuffer): WordArray {
    return new Uint32Array(n as number);
}

export type IntArray = Int32Array;

export function IntArray(n: number | number[] | ArrayBuffer): IntArray {
    return new Int32Array(n as number);
}

export type NumArray = Float64Array;

export function NumArray(n: number | number[] | ArrayBuffer): NumArray {
    return new Float64Array(n as number);
}
