// @strictNullChecks: true
// @noimplicitany: true
// @declaration: true

type Box<T> = {
    value: T;
}

type Boxified<T> = {
    [P in keyof T]: Box<T[P]>;
}

declare function boxify<T>(obj: T): Boxified<T>;

let v = {
    a: 42,
    b: "hello",
    c: true
};
let b = boxify(v);
let x: number = b.a.value;