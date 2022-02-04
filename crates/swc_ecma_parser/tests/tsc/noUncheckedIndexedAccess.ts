// @strict: true
// @noUncheckedIndexedAccess: true

type CheckBooleanOnly<T extends boolean> = any;
// Validate CheckBooleanOnly works - should error
type T_ERR1 = CheckBooleanOnly<boolean | undefined>;

enum NumericEnum1 { A, B, C }
enum NumericEnum2 { A = 0, B = 1 , C = 2 }
enum StringEnum1 { A = "Alpha", B = "Beta" }

declare const strMap: { [s: string]: boolean };

// All of these should be errors
const e1: boolean = strMap["foo"];
const e2: boolean = strMap.bar;
const e3: boolean = strMap[0];
const e4: boolean = strMap[0 as string | number];
const e5: boolean = strMap[0 as string | 0 | 1];
const e6: boolean = strMap[0 as 0 | 1];
const e7: boolean = strMap["foo" as "foo" | "baz"];
const e8: boolean = strMap[NumericEnum1.A];
const e9: boolean = strMap[NumericEnum2.A];
const e10: boolean = strMap[StringEnum1.A];
const e11: boolean = strMap[StringEnum1.A as StringEnum1];
const e12: boolean = strMap[NumericEnum1.A as NumericEnum1];
const e13: boolean = strMap[NumericEnum2.A as NumericEnum2];
const e14: boolean = strMap[null as any];

// Should be OK
const ok1: boolean | undefined = strMap["foo"];
const ok2: boolean | undefined = strMap.bar;

type T_OK1 = CheckBooleanOnly<(typeof strMap)[string]>;
type T_OK2 = CheckBooleanOnly<(typeof strMap)["foo"]>;
type T_OK3 = CheckBooleanOnly<(typeof strMap)["bar" | "baz"]>;
type T_OK4 = CheckBooleanOnly<(typeof strMap)[number]>;
type T_OK5 = CheckBooleanOnly<(typeof strMap)[any]>;

// Writes don't allow 'undefined'; all should be errors
strMap["baz"] = undefined;
strMap.qua = undefined;
strMap[0] = undefined;
strMap[null as any] = undefined;

// Numeric lookups are unaffected
declare const numMap: { [s: number]: boolean };
// All of these should be ok
const num_ok1: boolean = numMap[0];
const num_ok2: boolean = numMap[0 as number];
const num_ok3: boolean = numMap[0 as 0 | 1];
const num_ok4: boolean = numMap[NumericEnum1.A];
const num_ok5: boolean = numMap[NumericEnum2.A];

// Generics
function generic1<T extends { [s: string]: boolean }>(arg: T): boolean {
    // Should error
    return arg["blah"];
}
function generic2<T extends { [s: string]: boolean }>(arg: T): boolean {
    // Should OK
    return arg["blah"]!;
}
function generic3<T extends string>(arg: T): boolean {
    // Should error
    return strMap[arg];
}

// Element access into known properties is ok
declare const obj1: { x: string, y: number, [key: string]: string | number };
obj1["x"];
const y = "y";
obj1[y];
let yy = "y";
obj1[yy];
let z = "z";
obj1[z];

// Distributivity cases
declare const strMapUnion: { [s: string]: boolean } | { [s: string]: number };
// Should error
const f1: boolean | number = strMapUnion["foo"];

// Symbol index signatures
declare const s: unique symbol;
declare const symbolMap: { [s]: string };
const e15: string = symbolMap[s]; // Should OK
symbolMap[s] = undefined; // Should error

// Variadic tuples
declare const nonEmptyStringArray: [string, ...string[]];
const variadicOk1: string = nonEmptyStringArray[0];  // Should OK
const variadicError1: string = nonEmptyStringArray[1]; // Should error

// Generic index type
declare const myRecord1: { a: string; b: string };
declare const myRecord2: { a: string; b: string, [key: string]: string };
const fn1 = <Key extends keyof typeof myRecord1>(key: Key): string => myRecord1[key]; // Should OK
const fn2 = <Key extends keyof typeof myRecord1>(key: Key): string => myRecord2[key]; // Should OK
const fn3 = <Key extends keyof typeof myRecord2>(key: Key) => {
    myRecord2[key] = undefined; // Should error
    const v: string = myRecord2[key]; // Should error
};

