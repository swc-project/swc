namespace N {
    export const value = 1;
    export interface T { outer: true; }
}
namespace N {
    export type EmptyFirst = ({}: typeof value, value: number) => typeof value;
    export type Nested = (value: number) => (inner: typeof value) => typeof inner;
    export type Destructured = ({ value: local }: { value: number }) => typeof local;
    export type Generic<T> = <U extends T>(value: U) => U;
    export type Mapped<T> = { [K in keyof T]: T[K] };
    export type Conditional<T> = T extends { value: infer U } ? U : T;
    export interface Methods<T> {
        generic<T>(): T;
        [value](value: T): typeof value;
        new ({}: typeof value, value: T): { value: typeof value };
    }
    export class Box<T> {
        method(value: T): T { return value; }
    }
    export function generic<T>() { return (value: T): T => value; }
    export const arrow = <T>(value: T): T => value;
}
