type Z = { a: number };
type Clone<T> = {
    [P in keyof (T & {})]: T[P];
};
type M = Clone<Z>; // M should be { a: number }

var z1: Z;
var z1: Clone<Z>;
