interface X { outer: true; }
const X = 2;
namespace N { export const X = 1; }
namespace N {
    export type Function = (X: number) => typeof X;
    export type Constructor = new (X: number) => { value: typeof X };
    export type Call = { (X: number): typeof X };
    export type Construct = { new (X: number): { value: typeof X } };
    export type Method = { method(X: number): typeof X };
    export type Index = { [X: string]: typeof X };
    export type Rest = (...X: number[]) => typeof X;
    export type ObjectPattern = ({ X }: { X: number }) => typeof X;
    export type ArrayPattern = ([X]: number[]) => typeof X;
    export type Annotation = (X: X) => typeof X;
    export type Forward = (first: typeof X, X: number) => typeof X;
    export type Computed = { [X]<X>(value: X): X };
    export type Instantiation = typeof create<X>;
    export const y = X;
}
declare function create<T>(value: T): T;
