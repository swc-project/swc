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

declare let b: {
    a: Box<number> | Box<string> | Box<boolean>;
    b: Box<number> | Box<string> | Box<boolean>;
    c: Box<number> | Box<string> | Box<boolean>;
};
let v = unboxify(b);