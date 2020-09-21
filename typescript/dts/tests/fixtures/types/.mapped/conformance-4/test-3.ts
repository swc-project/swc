type DeepReadonly<T> = {
    readonly [P in keyof T]: DeepReadonly<T[P]>;
};

type Foo = {
    x: number;
    y: { a: string, b: number };
    z: boolean;
};

type DeepReadonlyFoo = {
    readonly x: number;
    readonly y: { readonly a: string, readonly b: number };
    readonly z: boolean;
};

var x1: DeepReadonly<Foo>;
var x1: DeepReadonlyFoo;