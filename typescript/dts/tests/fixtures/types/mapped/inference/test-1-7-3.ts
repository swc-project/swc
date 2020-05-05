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

// Inferring to { [P in K]: X }, where K extends keyof T, produces same inferences as
// inferring to { [P in keyof T]: X }.

declare function f20<T, K extends keyof T>(obj: Pick<T, K>): T;

declare function f21<T, K extends keyof T>(obj: Pick<T, K>): K;

declare function f22<T, K extends keyof T>(obj: Boxified<Pick<T, K>>): T;

declare function f23<T, U extends keyof T, K extends U>(obj: Pick<T, K>): T;

declare function f24<T, U, K extends keyof T | keyof U>(obj: Pick<T & U, K>): T & U;

let x0 = f20({foo: 42, bar: "hello"});
let x1 = f21({foo: 42, bar: "hello"});
let x2 = f22({foo: {value: 42}, bar: {value: "hello"}});
let x3 = f23({foo: 42, bar: "hello"});
let x4 = f24({foo: 42, bar: "hello"});
