namespace N__2 {
    export const value__3 = 1;
    export interface T__3 {
        outer__0: true;
    }
    export namespace Inner__3 {
        export const value__4 = 2;
        export interface T__4 {
            inner__0: true;
        }
    }
}
namespace N__2 {
    export namespace Inner__5 {
        export interface Signatures__6<T__7> {
            ({}: typeof value__8, value__8: T__7) : typeof value__8;
            new(T__9: T__7): typeof T__9;
            method__0<T__10 extends {
                inner__0: true;
            }>(value__10: T__10): typeof value__10;
            nested__0: (value__11: T__7) => (T__12: typeof value__11) => typeof T__12;
        }
        export const read__6 = value__4;
    }
}
