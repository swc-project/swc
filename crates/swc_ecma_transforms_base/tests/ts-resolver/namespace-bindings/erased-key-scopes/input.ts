declare const key: unique symbol;
namespace N {
    export const value = 1;
}
namespace N {
    export interface Shape {
        method({ [((value: typeof key) => value)(key) as typeof key]: value }: { [key]: number }): typeof value;
    }
    export type ObjectShape = ({
        [(function value(): typeof key {
            const local = key;
            return local as typeof key;
        })() as typeof key]: value
    }: { [key]: number }) => typeof value;
    export const read = value;
}
