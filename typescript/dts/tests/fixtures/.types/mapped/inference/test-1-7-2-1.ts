type Func<T> = (...args: any[]) => T;
type Spec<T> = {
    [P in keyof T]: Func<T[P]> | Spec<T[P]>;
};

declare function applySpec<T>(obj: Spec<T>): (...args: any[]) => T;

// Infers g1: (...args: any[]) => { sum: number, nested: { mul: string } }
var g1 = applySpec({
    sum: (a: any) => 3,
    nested: {
        mul: (b: any) => "n"
    }
});
