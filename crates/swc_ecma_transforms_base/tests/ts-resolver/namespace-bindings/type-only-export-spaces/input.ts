interface X { outer: true }
declare namespace N {
    const value: 1;
    class Model { inner: true }
    export type { value as X, Model as C };
}
namespace N {
    export type Value = X;
    export type Class = C;
    export type Query = typeof X;
}
