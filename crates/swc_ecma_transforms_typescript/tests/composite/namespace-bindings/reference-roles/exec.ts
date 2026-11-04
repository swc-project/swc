namespace Fixture {
    namespace N {
        export let value = 1;
        export const key = "value";
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
    }
    expect([N.read({ value: 9 }), N.recurse(3), new N.Box().self === N.Box,
        new N.Box().method(4), new N.Item().item, N.arrow({ value: 5 }),
        N.assign({ value: 6 }), N.value, N.caught()])
        .toEqual([9, 0, true, 4, 1, 5, 7, 7, 3]);
}
