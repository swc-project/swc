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

declare function unbox<T>(x: Box<T>): T;

declare function boxify<T>(obj: T): Boxified<T>;

declare function unboxify<T>(obj: Boxified<T>): T ;

function assignBoxified<T>(obj: Boxified<T>, values: T) {
    for (let k in values) {
        obj[k].value = values[k];
    }
}

function makeRecord<T, K extends string>(obj: { [P in K]: T }) {
    return obj;
}

let b = makeRecord({
    a: box(42),
    b: box("hello"),
    c: box(true)
});