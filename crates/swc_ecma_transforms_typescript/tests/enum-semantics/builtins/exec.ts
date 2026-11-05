namespace Numbers {
    export const Infinity = 7;
    export const NaN = 8;
    export enum E { A = Infinity, B = NaN }
}
function shadowed(Infinity: number) { enum E { A = Infinity } return E.A; }
enum Numeric {
    NegativeZero = -0,
    NegativeInfinity = 1 / NegativeZero,
    Nan = 1 ** Infinity,
    Shift = -1 >>> 1,
    Signed = 0xffffffff | 0,
    Raw = 0x10,
    Computed = Raw + 1
}
const result = [Numbers.E.A, Numbers.E.B, Numeric.Shift, Numeric.Signed];

expect(result).toEqual([7, 8, 2147483647, -1]);
expect(shadowed(5)).toBe(5);
expect(Numeric.NegativeInfinity).toBe(-Infinity);
expect(Number.isNaN(Numeric.Nan)).toBe(true);
