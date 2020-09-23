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

declare function makeDictionary<D>(obj: {
    [x: string]: D;
}): {
    [x: string]: D;
};

declare var s: string;

let b = makeDictionary({
    a: box(42),
    b: box("hello"),
    c: box(true)
});
let v = unboxify(b);
let x: string | number | boolean = v[s];