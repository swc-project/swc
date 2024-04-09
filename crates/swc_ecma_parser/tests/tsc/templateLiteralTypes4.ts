// @strict: true
// @target: esnext
// @declaration: true

// infer from number
type TNumber0 = "100" extends `${infer N extends number}` ? N : never; // 100
type TNumber1 = "-100" extends `${infer N extends number}` ? N : never; // -100
type TNumber2 = "1.1" extends `${infer N extends number}` ? N : never; // 1.1
type TNumber3 = "8e-11" extends `${infer N extends number}` ? N : never; // 8e-11 (0.00000000008)
type TNumber4 = "0x10" extends `${infer N extends number}` ? N : never; // number (not round-trippable)
type TNumber5 = "0o10" extends `${infer N extends number}` ? N : never; // number (not round-trippable)
type TNumber6 = "0b10" extends `${infer N extends number}` ? N : never; // number (not round-trippable)
type TNumber7 = "10e2" extends `${infer N extends number}` ? N : never; // number (not round-trippable)
type TNumber8 = "abcd" extends `${infer N extends number}` ? N : never; // never

// infer from bigint
type TBigInt0 = "100" extends `${infer N extends bigint}` ? N : never; // 100n
type TBigInt1 = "-100" extends `${infer N extends bigint}` ? N : never; // -100n
type TBigInt2 = "0x10" extends `${infer N extends bigint}` ? N : never; // bigint (not round-trippable)
type TBigInt3 = "0o10" extends `${infer N extends bigint}` ? N : never; // bigint (not round-trippable)
type TBigInt4 = "0b10" extends `${infer N extends bigint}` ? N : never; // bigint (not round-trippable)
type TBigInt5 = "1.1" extends `${infer N extends bigint}` ? N : never; // never
type TBigInt6 = "10e2" extends `${infer N extends bigint}` ? N : never; // never
type TBigInt7 = "abcd" extends `${infer N extends bigint}` ? N : never; // never

// infer from boolean
type TBoolean0 = "true" extends `${infer T extends boolean}` ? T : never; // true
type TBoolean1 = "false" extends `${infer T extends boolean}` ? T : never; // false
type TBoolean2 = "abcd" extends `${infer T extends boolean}` ? T : never; // never

// infer from null
type TNull0 = "null" extends `${infer T extends null}` ? T : never; // null
type TNull1 = "abcd" extends `${infer T extends null}` ? T : never; // never

// infer from undefined
type TUndefined0 = "undefined" extends `${infer T extends undefined}` ? T : never; // undefined
type TUndefined1 = "abcd" extends `${infer T extends undefined}` ? T : never; // never

// infer from literal enums
const enum StringLiteralEnum { Zero = "0", True = "true", False = "false", Undefined = "undefined", Null = "null" }
type TStringLiteralEnum0 = "0" extends `${infer T extends StringLiteralEnum}` ? T : never; // StringLiteralEnum.Zero

const enum NumberLiteralEnum { Zero, One }
type TNumberLiteralEnum0 = "0" extends `${infer T extends NumberLiteralEnum}` ? T : never; // NumberLiteralEnum.Zero

// infer from non-literal enums
const enum NonLiteralEnum { Zero = NumberLiteralEnum.Zero, One = NumberLiteralEnum.One }
type TNonLiteralEnum0 = "0" extends `${infer T extends NonLiteralEnum}` ? T : never; // 0

// infer using priority:
//     string > template-literal > (string-literal | string-literal-enum) >
//     number > enum > (number-literal | number-literal-enum) >
//     bigint > bigint-literal > 
//     boolean > (boolean-literal | undefined | null)

// #region string
// string > string-literal-enum
type PString00 = "0" extends `${infer T extends string | StringLiteralEnum}` ? T : never; // "0"

// string > number
type PString01 = "0" extends `${infer T extends string | number}` ? T : never; // "0"

// string > enum
type PString02 = "0" extends `${infer T extends string | NonLiteralEnum}` ? T : never; // "0"

// string > (number-literal | number-literal-enum)
type PString03 = "0" extends `${infer T extends string | 0}` ? T : never; // "0"
type PString04 = "0" extends `${infer T extends string | NumberLiteralEnum}` ? T : never; // "0"

// string > bigint
type PString05 = "0" extends `${infer T extends string | bigint}` ? T : never; // "0"

// string > bigint-literal
type PString06 = "0" extends `${infer T extends string | 0n}` ? T : never; // "0"

// string > boolean
type PString07 = "true" extends `${infer T extends string | boolean}` ? T : never; // "true"
type PString08 = "false" extends `${infer T extends string | boolean}` ? T : never; // "false"

// string > (boolean-literal | undefined | null)
type PString09 = "true" extends `${infer T extends string | true}` ? T : never; // "true"
type PString10 = "false" extends `${infer T extends string | false}` ? T : never; // "false"
type PString11 = "undefined" extends `${infer T extends string | undefined}` ? T : never; // "undefined"
type PString12 = "null" extends `${infer T extends string | null}` ? T : never; // "null"
// #endregion string

// #region template-literal
// template-literal > number
type PTemplate00 = "10" extends `${infer T extends `1${string}` | number}` ? T : never; // "10"

// template-literal > enum
type PTemplate01 = "10" extends `${infer T extends `1${string}` | NonLiteralEnum}` ? T : never; // "10"

// template-literal > (number-literal | number-literal-enum)
type PTemplate02 = "10" extends `${infer T extends `1${string}` | 10}` ? T : never; // "10"
type PTemplate03 = "10" extends `${infer T extends `1${string}` | NumberLiteralEnum}` ? T : never; // "10"

// template-literal > bigint
type PTemplate04 = "10" extends `${infer T extends `1${string}` | bigint}` ? T : never; // "10"

// template-literal > bigint-literal
type PTemplate05 = "10" extends `${infer T extends `1${string}` | 10n}` ? T : never; // "10"

// template-literal > boolean
type PTemplate06 = "true" extends `${infer T extends `${string}e` | boolean}` ? T : never; // "true"
type PTemplate07 = "false" extends `${infer T extends `${string}e` | boolean}` ? T : never; // "false"

// template-literal > (boolean-literal | undefined | null)
type PTemplate08 = "true" extends `${infer T extends `${"t"}${string}` | true}` ? T : never; // "true"
type PTemplate09 = "false" extends `${infer T extends `${"f"}${string}` | false}` ? T : never; // "false"
type PTemplate10 = "undefined" extends `${infer T extends `${"u"}${string}` | undefined}` ? T : never; // "undefined"
type PTemplate11 = "null" extends `${infer T extends `${"n"}${string}` | null}` ? T : never; // "null"
// #endregion template-literal

// #region string-literal
// string-literal > number
type PStringLiteral00 = "0" extends `${infer T extends "0" | number}` ? T : never; // "0"

// string-literal > enum
type PStringLiteral01 = "0" extends `${infer T extends "0" | NonLiteralEnum}` ? T : never; // "0"

// string-literal > (number-literal | number-literal-enum)
type PStringLiteral02 = "0" extends `${infer T extends "0" | 0}` ? T : never; // "0"
type PStringLiteral03 = "0" extends `${infer T extends "0" | NumberLiteralEnum}` ? T : never; // "0"

// string-literal > bigint
type PStringLiteral04 = "0" extends `${infer T extends "0" | bigint}` ? T : never; // "0"

// string-literal > bigint-literal
type PStringLiteral05 = "0" extends `${infer T extends "0" | 0n}` ? T : never; // "0"

// string-literal > boolean
type PStringLiteral06 = "true" extends `${infer T extends "true" | "false" | boolean}` ? T : never; // "true"
type PStringLiteral07 = "false" extends `${infer T extends "true" | "false" | boolean}` ? T : never; // "false"

// string-literal > (boolean-literal | undefined | null)
type PStringLiteral08 = "true" extends `${infer T extends "true" | true}` ? T : never; // "true"
type PStringLiteral09 = "false" extends `${infer T extends "false" | false}` ? T : never; // "false"
type PStringLiteral10 = "undefined" extends `${infer T extends "undefined" | undefined}` ? T : never; // "undefined"
type PStringLiteral11 = "null" extends `${infer T extends "null" | null}` ? T : never; // "null"
// #endregion string-literal

// #region string-literal-enum
// string-literal-enum > number
type PStringLiteralEnum00 = "0" extends `${infer T extends StringLiteralEnum | number}` ? T : never; // StringLiteralEnum.Zero

// string-literal-enum > enum
type PStringLiteralEnum01 = "0" extends `${infer T extends StringLiteralEnum | NonLiteralEnum}` ? T : never; // StringLiteralEnum.Zero

// string-literal-enum > (number-literal | number-literal-enum)
type PStringLiteralEnum02 = "0" extends `${infer T extends StringLiteralEnum | 0}` ? T : never; // StringLiteralEnum.Zero
type PStringLiteralEnum03 = "0" extends `${infer T extends StringLiteralEnum | NumberLiteralEnum}` ? T : never; // StringLiteralEnum.Zero

// string-literal-enum > bigint
type PStringLiteralEnum04 = "0" extends `${infer T extends StringLiteralEnum | bigint}` ? T : never; // StringLiteralEnum.Zero

// string-literal-enum > bigint-literal
type PStringLiteralEnum05 = "0" extends `${infer T extends StringLiteralEnum | 0n}` ? T : never; // StringLiteralEnum.Zero

// string-literal-enum > boolean
type PStringLiteralEnum06 = "true" extends `${infer T extends StringLiteralEnum | boolean}` ? T : never; // StringLiteralEnum.True
type PStringLiteralEnum07 = "false" extends `${infer T extends StringLiteralEnum | boolean}` ? T : never; // StringLiteralEnum.False

// string-literal-enum > (boolean-literal | undefined | null)
type PStringLiteralEnum08 = "true" extends `${infer T extends StringLiteralEnum | true}` ? T : never; // StringLiteralEnum.True
type PStringLiteralEnum09 = "false" extends `${infer T extends StringLiteralEnum | false}` ? T : never; // StringLiteralEnum.False
type PStringLiteralEnum10 = "undefined" extends `${infer T extends StringLiteralEnum | undefined}` ? T : never; // StringLiteralEnum.Undefined
type PStringLiteralEnum11 = "null" extends `${infer T extends StringLiteralEnum | null}` ? T : never; // StringLiteralEnum.Null
// #endregion string-literal-enum

// #region number
// number > enum
type PNumber0 = "0" extends `${infer T extends number | NonLiteralEnum}` ? T : never; // 0

// number > number-literal-enum
type PNumber1 = "0" extends `${infer T extends number | NumberLiteralEnum}` ? T : never; // 0

// number > bigint
type PNumber2 = "0" extends `${infer T extends number | bigint}` ? T : never; // 0

// number > bigint-literal
type PNumber3 = "0" extends `${infer T extends number | 0n}` ? T : never; // 0
// #endregion number

// #region enum
// enum > number-literal-enum
type PEnum0 = "0" extends `${infer T extends NonLiteralEnum | NumberLiteralEnum}` ? T : never; // 0

// enum > bigint
type PEnum1 = "0" extends `${infer T extends NonLiteralEnum | bigint}` ? T : never; // 0

// enum > bigint-literal
type PEnum2 = "0" extends `${infer T extends NonLiteralEnum | 0n}` ? T : never; // 0
// #endregion enum

// #region number-literal
// number-literal > bigint
type PNumberLiteral0 = "0" extends `${infer T extends 0 | bigint}` ? T : never; // 0

// number-literal > bigint-literal
type PNumberLiteral1 = "0" extends `${infer T extends 0 | 0n}` ? T : never; // 0
// #endregion number-literal

// #region number-literal-enum
// number-literal-enum > bigint
type PNumberLiteralEnum0 = "0" extends `${infer T extends NumberLiteralEnum | bigint}` ? T : never; // NumberLiteralEnum.Zero

// number-literal-enum > bigint-literal
type PNumberLiteralEnum1 = "0" extends `${infer T extends NumberLiteralEnum | 0n}` ? T : never; // NumberLiteralEnum.Zero
// #endregion number-literal-enum

// non-matchable constituents are excluded
type PExclude0 = "0" extends `${infer T extends "1" | number}` ? T : never; // 0
type PExclude1 = "0" extends `${infer T extends `1${string}` | number}` ? T : never; // 0
type PExclude2 = "0" extends `${infer T extends 1 | bigint}` ? T : never; // 0n
type PExclude3 = "0" extends `${infer T extends NumberLiteralEnum.One | bigint}` ? T : never; // 0n
type PExclude4 = "100000000000000000000000" extends `${infer T extends number | bigint}` ? T : never; // 100000000000000000000000n

// infer to prefix from string
type TPrefix0 = "100" extends `${infer T extends number}${string}` ? T : never; // 1
type TPrefix1 = "trueabc" extends `${infer T extends boolean}${string}` ? T : never; // boolean (T only receives 't', not the whole string)
type TPrefix2 = `100:${string}` extends `${infer T extends number}:${string}` ? T : never; // 100 (T receives '100' because it scans until ':')

// can use union w/multiple branches to extract each possibility
type ExtractPrimitives<T extends string> =
    | T
    | (T extends `${infer U extends number}` ? U : never)
    | (T extends `${infer U extends bigint}` ? U : never)
    | (T extends `${infer U extends boolean | null | undefined}` ? U : never)
    ;

type TExtract0 = ExtractPrimitives<"100">; // "100" | 100 | 100n
type TExtract1 = ExtractPrimitives<"1.1">; // "1.1" | 1.1
type TExtract2 = ExtractPrimitives<"true">; // "true" | true



// example use case (based on old TypedObjects proposal):

// Use constrained `infer` in template literal to get ordinal indices as numbers:
type IndexFor<S extends string> = S extends `${infer N extends number}` ? N : never;
type IndicesOf<T> = IndexFor<Extract<keyof T, string>>; // ordinal indices as number literals

interface FieldDefinition {
    readonly name: string;
    readonly type: "i8" | "i16" | "i32" | "i64" | "u8" | "u16" | "u32" | "u64" | "f32" | "f64";
}

type FieldType<T extends FieldDefinition["type"]> =
    T extends "i8" | "i16" | "i32" | "u8" | "u16" | "u32" | "f32" | "f64" ? number :
    T extends "f32" | "f64" ? bigint :
    never;

// Generates named members like `{ x: number, y: bigint }` from `[{ name: "x", type: "i32" }, { name: "y", type: "i64" }]`
type TypedObjectNamedMembers<TDef extends readonly FieldDefinition[]> = {
    [P in TDef[number]["name"]]: FieldType<Extract<TDef[number], { readonly name: P }>["type"]>;
};

// Generates ordinal members like `{ 0: number, 1: bigint }` from `[{ name: "x", type: "i32" }, { name: "y", type: "i64" }]`
type TypedObjectOrdinalMembers<TDef extends readonly FieldDefinition[]> = {
    [I in Extract<keyof TDef, `${number}`>]: FieldType<Extract<TDef[I], FieldDefinition>["type"]>;
};

// Default members
interface TypedObjectMembers<TDef extends readonly FieldDefinition[]> {
    // get/set a field by name
    get<K extends TDef[number]["name"]>(key: K): FieldType<Extract<TDef[number], { readonly name: K }>["type"]>;
    set<K extends TDef[number]["name"]>(key: K, value: FieldType<Extract<TDef[number], { readonly name: K }>["type"]>): void;

    // get/set a field by index
    getIndex<I extends IndicesOf<TDef>>(index: I): FieldType<Extract<TDef[I], FieldDefinition>["type"]>;
    setIndex<I extends IndicesOf<TDef>>(index: I, value: FieldType<Extract<TDef[I], FieldDefinition>["type"]>): void;
}

type TypedObject<TDef extends readonly FieldDefinition[]> =
    & TypedObjectMembers<TDef>
    & TypedObjectNamedMembers<TDef>
    & TypedObjectOrdinalMembers<TDef>;

// NOTE: type would normally be created from something like `const Point = TypedObject([...])` from which we would infer the type
type Point = TypedObject<[
    { name: "x", type: "f64" },
    { name: "y", type: "f64" },
]>;

declare const p: Point;
p.getIndex(0); // ok, 0 is a valid index
p.getIndex(1); // ok, 1 is a valid index
p.getIndex(2); // error, 2 is not a valid index

p.setIndex(0, 0); // ok, 0 is a valid index
p.setIndex(1, 0); // ok, 1 is a valid index
p.setIndex(2, 3); // error, 2 is not a valid index

// function inference
declare function f1<T extends string | number>(s: `**${T}**`): T;
f1("**123**"); // "123"

declare function f2<T extends number>(s: `**${T}**`): T;
f2("**123**"); // 123

declare function f3<T extends bigint>(s: `**${T}**`): T;
f3("**123**"); // 123n

declare function f4<T extends boolean>(s: `**${T}**`): T;
f4("**true**"); // true | "true"
f4("**false**"); // false | "false"
