declare const key__2: unique symbol;
namespace N__2 {
    export const value__3 = 1;
}
namespace N__2 {
    export interface Shape__4 {
        method__0({ [((value__5: typeof key__2)=>value__5)(key__2) as typeof key__2]: value__6 }: {
            [key__2]: number;
        }): typeof value__6;
    }
    export type ObjectShape__4 = ({ [(function value__7(): typeof key__2 {
        const local__8 = key__2;
        return local__8 as typeof key__2;
    })() as typeof key__2]: value__9 }: {
        [key__2]: number;
    }) => typeof value__9;
    export const read__4 = value__3;
}
