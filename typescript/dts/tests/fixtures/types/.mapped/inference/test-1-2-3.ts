// @strictNullChecks: true
// @noimplicitany: true
// @declaration: true

type Box<T> = {
    value: T;
}

type Boxified<T> = {
    [P in keyof T]: Box<T[P]>;
}

declare function box<T>(x: T): Box<T>;

declare function unboxify<T>(obj: Boxified<T>): T;

let b = {
    a: box(42),
    b: box("hello"),
    c: box(true)
};
let v = unboxify(b);