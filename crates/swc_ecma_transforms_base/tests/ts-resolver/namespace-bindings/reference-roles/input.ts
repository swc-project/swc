namespace N {
    export let value = 1;
    export const key = "value";
    export interface T { outer: true; }
}
namespace N {
    export function read({ [key]: value }: { value: number }) { return value; }
    export const recurse = function value(input: number): number {
        return input > 0 ? value(input - 1) : 0;
    };
    export const Box = class value {
        self = value;
        method(value: number) { return value; }
    };
    export class Item {
        constructor(public item: number = value) {}
    }
    export const arrow = ({ value }: { value: number }) => value;
    export function assign(source: { value: number }) {
        ({ value } = source);
        [value] = [source.value + 1];
        return value;
    }
    export function caught() {
        try { throw 3; } catch (value) { return value; }
    }
    export type Signature<T> = <U extends T>({ [key]: value }: { value: U }) => typeof value;
}
