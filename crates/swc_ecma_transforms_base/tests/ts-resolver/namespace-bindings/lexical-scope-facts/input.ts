namespace N {
    export const value = 1;
    export interface T { outer: true; }
    export namespace Inner {
        export const value = 2;
        export interface T { inner: true; }
    }
}
namespace N {
    export namespace Inner {
        export interface Signatures<T> {
            ({}: typeof value, value: T): typeof value;
            new (T: T): typeof T;
            method<T extends { inner: true }>(value: T): typeof value;
            nested: (value: T) => (T: typeof value) => typeof T;
        }
        export const read = value;
    }
}
