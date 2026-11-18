namespace N__2 {
    export let value__3 = 1;
    export const key__3 = "value";
    export interface T__3 {
        outer__0: true;
    }
}
namespace N__2 {
    export function read__4({ [key__3]: value__5 }: {
        value__0: number;
    }) {
        return value__5;
    }
    export const recurse__4 = function value__6(input__7: number): number {
        return input__7 > 0 ? value__6(input__7 - 1) : 0;
    };
    export const Box__4 = class value__8 {
        self = value__8;
        method(value__9: number) {
            return value__9;
        }
    };
    export class Item__4 {
        constructor(public item__10: number = value__3){}
    }
    export const arrow__4 = ({ value__11 }: {
        value__0: number;
    })=>value__11;
    export function assign__4(source__12: {
        value__0: number;
    }) {
        ({ value__3 } = source__12);
        [value__3] = [
            source__12.value + 1
        ];
        return value__3;
    }
    export function caught__4() {
        try {
            throw 3;
        } catch (value__15) {
            return value__15;
        }
    }
    export type Signature__4<T__16> = <U__17 extends T__16>({ [key__3]: value__17 }: {
        value__0: U__17;
    }) => typeof value__17;
}
