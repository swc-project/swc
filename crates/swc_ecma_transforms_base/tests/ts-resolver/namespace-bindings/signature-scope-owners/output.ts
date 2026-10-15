namespace N__2 {
    export const value__3 = 1;
    export interface T__3 {
        outer__0: true;
    }
}
namespace N__2 {
    export type EmptyFirst__4 = ({}: typeof value__5, value__5: number) => typeof value__5;
    export type Nested__4 = (value__6: number) => (inner__7: typeof value__6) => typeof inner__7;
    export type Destructured__4 = ({ value: local__8 }: {
        value__0: number;
    }) => typeof local__8;
    export type Generic__4<T__9> = <U__10 extends T__9>(value__10: U__10) => U__10;
    export type Mapped__4<T__11> = {
        [K__11 in keyof T__11]: T__11[K__11];
    };
    export type Conditional__4<T__12> = T__12 extends {
        value__0: infer U;
    } ? U : T__12;
    export interface Methods__4<T__13> {
        generic__0<T__14>(): T__14;
        [value__3](value__15: T__13): typeof value__15;
        new({}: typeof value__16, value__16: T__13): {
            value__0: typeof value__16;
        };
    }
    export class Box__4<T__17> {
        method(value__18: T__17): T__17 {
            return value__18;
        }
    }
    export function generic__4<T__19>() {
        return (value__20: T__19): T__19 =>value__20;
    }
    export const arrow__4 = <T__21, >(value__21: T__21): T__21 =>value__21;
}
