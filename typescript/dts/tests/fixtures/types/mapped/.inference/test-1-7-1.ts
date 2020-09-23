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

type Foo = {
    a?: number;
    readonly b: string;
}

function f10(foo: Foo) {
    let x = validate(foo);  // { a: number, readonly b: string }
    let y = clone(foo);  // { a?: number, b: string }
    let z = validateAndClone(foo);  // { a: number, b: string }
}
