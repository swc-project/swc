// @strictNullChecks: true
// @noimplicitany: true
// @declaration: true

declare type Box<T> = {
    value: T;
};
declare type Boxified<T> = {
    [P in keyof T]: Box<T[P]>;
};
declare function box<T>(x: T): Box<T>;
declare function unbox<T>(x: Box<T>): T;
declare function boxify<T>(obj: T): Boxified<T>;
declare function unboxify<T>(obj: Boxified<T>): T;
declare function assignBoxified<T>(obj: Boxified<T>, values: T): void;

declare function validate<T>(obj: { [P in keyof T]?: T[P] }): T;

declare function clone<T>(obj: { readonly [P in keyof T]: T[P] }): T;

declare function validateAndClone<T>(obj: { readonly [P in keyof T]?: T[P] }): T;

// Repro from #12606

type Func<T> = (...args: any[]) => T;
type Spec<T> = {
    [P in keyof T]: Func<T[P]> | Spec<T[P]>;
};

const foo = <T>(object: T, partial: Partial<T>) => object;
let o = {a: 5, b: 7};
foo(o, {b: 9});
o = foo(o, {b: 9});
