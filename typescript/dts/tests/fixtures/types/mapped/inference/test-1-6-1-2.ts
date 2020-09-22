// @strictNullChecks: true
// @noimplicitany: true
// @declaration: true

declare type Box<T> = {
    value: T;
};
declare type Boxified<B> = {
    [P in keyof B]: Box<B[P]>;
};

declare function unboxify<T>(obj: Boxified<T>): T;

declare var s: string;

declare let b: {
    [x: string]: Box<number> | Box<string> | Box<boolean>;
};
let v = unboxify(b);
