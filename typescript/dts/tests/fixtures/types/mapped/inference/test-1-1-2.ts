// @strictNullChecks: true
// @noimplicitany: true
// @declaration: true

type Box<T> = {
    value: T;
}

type Boxified<T> = {
    [P in keyof T]: Box<T[P]>;
}

declare let b: Boxified<{
    a: number,
    b: string,
    c: boolean
}>;
let x = b.a.value;