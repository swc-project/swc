// @strict: true
// @declaration: true

type T00 = Exclude<"a" | "b" | "c" | "d", "a" | "c" | "f">;  // "b" | "d"
type T01 = Extract<"a" | "b" | "c" | "d", "a" | "c" | "f">;  // "a" | "c"

type T02 = Exclude<string | number | (() => void), Function>;  // string | number
type T03 = Extract<string | number | (() => void), Function>;  // () => void

type T04 = NonNullable<string | number | undefined>;  // string | number
type T05 = NonNullable<(() => string) | string[] | null | undefined>;  // (() => string) | string[]

function f1<T>(x: T, y: NonNullable<T>) {
    x = y;
    y = x;  // Error
}

function f2<T extends string | undefined>(x: T, y: NonNullable<T>) {
    x = y;
    y = x;  // Error
    let s1: string = x;  // Error
    let s2: string = y;
}

function f3<T>(x: Partial<T>[keyof T], y: NonNullable<Partial<T>[keyof T]>) {
    x = y;
    y = x;  // Error
}

function f4<T extends { x: string | undefined }>(x: T["x"], y: NonNullable<T["x"]>) {
    x = y;
    y = x;  // Error
    let s1: string = x;  // Error
    let s2: string = y;
}

type Options = { k: "a", a: number } | { k: "b", b: string } | { k: "c", c: boolean };

type T10 = Exclude<Options, { k: "a" | "b" }>;  // { k: "c", c: boolean }
type T11 = Extract<Options, { k: "a" | "b" }>;  // { k: "a", a: number } | { k: "b", b: string }

type T12 = Exclude<Options, { k: "a" } | { k: "b" }>;  // { k: "c", c: boolean }
type T13 = Extract<Options, { k: "a" } | { k: "b" }>;  // { k: "a", a: number } | { k: "b", b: string }

type T14 = Exclude<Options, { q: "a" }>;  // Options
type T15 = Extract<Options, { q: "a" }>;  // never

declare function f5<T extends Options, K extends string>(p: K): Extract<T, { k: K }>;
let x0 = f5("a");  // { k: "a", a: number }

type OptionsOfKind<K extends Options["k"]> = Extract<Options, { k: K }>;

type T16 = OptionsOfKind<"a" | "b">;  // { k: "a", a: number } | { k: "b", b: string }

type Select<T, K extends keyof T, V extends T[K]> = Extract<T, { [P in K]: V }>;

type T17 = Select<Options, "k", "a" | "b">;  // // { k: "a", a: number } | { k: "b", b: string }

type TypeName<T> =
    T extends string ? "string" :
    T extends number ? "number" :
    T extends boolean ? "boolean" :
    T extends undefined ? "undefined" :
    T extends Function ? "function" :
    "object";

type T20 = TypeName<string | (() => void)>;  // "string" | "function"
type T21 = TypeName<any>;  // "string" | "number" | "boolean" | "undefined" | "function" | "object"
type T22 = TypeName<never>;  // never
type T23 = TypeName<{}>;  // "object"

type KnockoutObservable<T> = { object: T };
type KnockoutObservableArray<T> = { array: T };

type KnockedOut<T> = T extends any[] ? KnockoutObservableArray<T[number]> : KnockoutObservable<T>;

type KnockedOutObj<T> = {
    [P in keyof T]: KnockedOut<T[P]>;
}

interface Item {
    id: number;
    name: string;
    subitems: string[];
}

type KOItem = KnockedOutObj<Item>;

interface Part {
    id: number;
    name: string;
    subparts: Part[];
    updatePart(newName: string): void;
}

type FunctionPropertyNames<T> = { [K in keyof T]: T[K] extends Function ? K : never }[keyof T];
type FunctionProperties<T> = Pick<T, FunctionPropertyNames<T>>;

type NonFunctionPropertyNames<T> = { [K in keyof T]: T[K] extends Function ? never : K }[keyof T];
type NonFunctionProperties<T> = Pick<T, NonFunctionPropertyNames<T>>;

type T30 = FunctionProperties<Part>;
type T31 = NonFunctionProperties<Part>;

function f7<T>(x: T, y: FunctionProperties<T>, z: NonFunctionProperties<T>) {
    x = y;  // Error
    x = z;  // Error
    y = x;
    y = z;  // Error
    z = x;
    z = y;  // Error
}

function f8<T>(x: keyof T, y: FunctionPropertyNames<T>, z: NonFunctionPropertyNames<T>) {
    x = y;
    x = z;
    y = x;  // Error
    y = z;  // Error
    z = x;  // Error
    z = y;  // Error
}

type DeepReadonly<T> =
    T extends any[] ? DeepReadonlyArray<T[number]> :
    T extends object ? DeepReadonlyObject<T> :
    T;

interface DeepReadonlyArray<T> extends ReadonlyArray<DeepReadonly<T>> {}

type DeepReadonlyObject<T> = {
    readonly [P in NonFunctionPropertyNames<T>]: DeepReadonly<T[P]>;
};

function f10(part: DeepReadonly<Part>) {
    let name: string = part.name;
    let id: number = part.subparts[0].id;
    part.id = part.id;  // Error
    part.subparts[0] = part.subparts[0];  // Error
    part.subparts[0].id = part.subparts[0].id;  // Error
    part.updatePart("hello");  // Error
}

type ZeroOf<T extends number | string | boolean> = T extends number ? 0 : T extends string ? "" : false;

function zeroOf<T extends number | string | boolean>(value: T) {
    return <ZeroOf<T>>(typeof value === "number" ? 0 : typeof value === "string" ? "" : false);
}

function f20<T extends string>(n: number, b: boolean, x: number | boolean, y: T) {
    zeroOf(5);  // 0
    zeroOf("hello");  // ""
    zeroOf(true);  // false
    zeroOf(n);  // 0
    zeroOf(b);  // False
    zeroOf(x);  // 0 | false
    zeroOf(y);  // ZeroOf<T>
}

function f21<T extends number | string>(x: T, y: ZeroOf<T>) {
    let z1: number | string = y;
    let z2: 0 | "" = y;
    x = y;  // Error
    y = x;  // Error
}

type T35<T extends { a: string, b: number }> = T[];
type T36<T> = T extends { a: string } ? T extends { b: number } ? T35<T> : never : never;
type T37<T> = T extends { b: number } ? T extends { a: string } ? T35<T> : never : never;
type T38<T> = [T] extends [{ a: string }] ? [T] extends [{ b: number }] ? T35<T> : never : never;

type Extends<T, U> = T extends U ? true : false;
type If<C extends boolean, T, F> = C extends true ? T : F;
type Not<C extends boolean> = If<C, false, true>;
type And<A extends boolean, B extends boolean> = If<A, B, false>;
type Or<A extends boolean, B extends boolean> = If<A, true, B>;

type IsString<T> = Extends<T, string>;

type Q1 = IsString<number>;  // false
type Q2 = IsString<"abc">;  // true
type Q3 = IsString<any>;  // boolean
type Q4 = IsString<never>;  // never

type N1 = Not<false>;  // true
type N2 = Not<true>;  // false
type N3 = Not<boolean>;  // boolean

type A1 = And<false, false>;  // false
type A2 = And<false, true>;  // false
type A3 = And<true, false>;  // false
type A4 = And<true, true>;  // true
type A5 = And<boolean, false>;  // false
type A6 = And<false, boolean>;  // false
type A7 = And<boolean, true>;  // boolean
type A8 = And<true, boolean>;  // boolean
type A9 = And<boolean, boolean>;  // boolean

type O1 = Or<false, false>;  // false
type O2 = Or<false, true>;  // true
type O3 = Or<true, false>;  // true
type O4 = Or<true, true>;  // true
type O5 = Or<boolean, false>;  // boolean
type O6 = Or<false, boolean>;  // boolean
type O7 = Or<boolean, true>;  // true
type O8 = Or<true, boolean>;  // true
type O9 = Or<boolean, boolean>;  // boolean

type T40 = never extends never ? true : false;  // true
type T41 = number extends never ? true : false;  // false
type T42 = never extends number ? true : false;  // true

type IsNever<T> = [T] extends [never] ? true : false;

type T50 = IsNever<never>;  // true
type T51 = IsNever<number>;  // false
type T52 = IsNever<any>;  // false

function f22<T>(x: T extends (infer U)[] ? U[] : never) {
    let e = x[0];  // {}
}

function f23<T extends string[]>(x: T extends (infer U)[] ? U[] : never) {
    let e = x[0];  // string
}

// Repros from #21664

type Eq<T, U> = T extends U ? U extends T ? true : false : false;
type T60 = Eq<true, true>;  // true
type T61 = Eq<true, false>;  // false
type T62 = Eq<false, true>;  // false
type T63 = Eq<false, false>;  // true

type Eq1<T, U> = Eq<T, U> extends false ? false : true;
type T70 = Eq1<true, true>;  // true
type T71 = Eq1<true, false>;  // false
type T72 = Eq1<false, true>;  // false
type T73 = Eq1<false, false>;  // true

type Eq2<T, U> = Eq<T, U> extends true ? true : false;
type T80 = Eq2<true, true>;  // true
type T81 = Eq2<true, false>;  // false
type T82 = Eq2<false, true>;  // false
type T83 = Eq2<false, false>;  // true

// Repro from #21756

type Foo<T> = T extends string ? boolean : number;
type Bar<T> = T extends string ? boolean : number;
const convert = <U>(value: Foo<U>): Bar<U> => value;

type Baz<T> = Foo<T>;
const convert2 = <T>(value: Foo<T>): Baz<T> => value;

function f31<T>() {
    type T1 = T extends string ? boolean : number;
    type T2 = T extends string ? boolean : number;
    var x: T1;
    var x: T2;
}

function f32<T, U>() {
    type T1 = T & U extends string ? boolean : number;
    type T2 = Foo<T & U>;
    var z: T1;
    var z: T2;  // Error, T2 is distributive, T1 isn't
}

function f33<T, U>() {
    type T1 = Foo<T & U>;
    type T2 = Bar<T & U>;
    var z: T1;
    var z: T2;
}

// Repro from #21823

type T90<T> = T extends 0 ? 0 : () => 0;
type T91<T> = T extends 0 ? 0 : () => 0;
const f40 = <U>(a: T90<U>): T91<U> => a;
const f41 = <U>(a: T91<U>): T90<U> => a;

type T92<T> = T extends () => 0 ? () => 1 : () => 2;
type T93<T> = T extends () => 0 ? () => 1 : () => 2;
const f42 = <U>(a: T92<U>): T93<U> => a;
const f43 = <U>(a: T93<U>): T92<U> => a;

type T94<T> = T extends string ? true : 42;
type T95<T> = T extends string ? boolean : number;
const f44 = <U>(value: T94<U>): T95<U> => value;
const f45 = <U>(value: T95<U>): T94<U> => value;  // Error

// Repro from #21863

function f50() {
    type Eq<T, U> = T extends U ? U extends T ? true : false : false;
    type If<S, T, U> = S extends false ? U : T;
    type Omit<T extends object> = { [P in keyof T]: If<Eq<T[P], never>, never, P>; }[keyof T];
    type Omit2<T extends object, U = never> = { [P in keyof T]: If<Eq<T[P], U>, never, P>; }[keyof T];
    type A = Omit<{ a: void; b: never; }>;  // 'a'
    type B = Omit2<{ a: void; b: never; }>;  // 'a'
}

// Repro from #21862

type OldDiff<T extends keyof any, U extends keyof any> = (
    & { [P in T]: P; }
    & { [P in U]: never; }
    & { [x: string]: never; }
)[T];
type NewDiff<T, U> = T extends U ? never : T;
interface A {
    a: 'a';
}
interface B1 extends A {
    b: 'b';
    c: OldDiff<keyof this, keyof A>;
}
interface B2 extends A {
    b: 'b';
    c: NewDiff<keyof this, keyof A>;
}
type c1 = B1['c']; // 'c' | 'b'
type c2 = B2['c']; // 'c' | 'b'

// Repro from #21929

type NonFooKeys1<T extends object> = OldDiff<keyof T, 'foo'>;
type NonFooKeys2<T extends object> = Exclude<keyof T, 'foo'>;

type Test1 = NonFooKeys1<{foo: 1, bar: 2, baz: 3}>;  // "bar" | "baz"
type Test2 = NonFooKeys2<{foo: 1, bar: 2, baz: 3}>;  // "bar" | "baz"

// Repro from #21729

interface Foo2 { foo: string; }
interface Bar2 { bar: string; }
type FooBar = Foo2 | Bar2;
declare interface ExtractFooBar<FB extends FooBar> { }

type Extracted<Struct> = {
    [K in keyof Struct]: Struct[K] extends FooBar ? ExtractFooBar<Struct[K]> : Struct[K];
}

// Repro from #22985

type RecursivePartial<T> = {
  [P in keyof T]?: T[P] extends Array<any> ? {[index: number]: RecursivePartial<T[P][0]>} :
    T[P] extends object ? RecursivePartial<T[P]> : T[P];
};

declare function assign<T>(o: T, a: RecursivePartial<T>): void;

var a = {o: 1, b: 2, c: [{a: 1, c: '213'}]}
assign(a, {o: 2, c: {0: {a: 2, c: '213123'}}})

// Repros from #23843

type Weird1 = (<U extends boolean>(a: U) => never) extends 
    (<U extends true>(a: U) => never) ? never : never;

type Weird2 = (<U extends boolean>(a: U) => U) extends 
    (<U extends true>(a: U) => infer T) ? T : never;
