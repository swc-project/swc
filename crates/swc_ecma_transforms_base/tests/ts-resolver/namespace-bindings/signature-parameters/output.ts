interface X__2 {
    outer__0: true;
}
const X__2 = 2;
namespace N__2 {
    export const X__3 = 1;
}
namespace N__2 {
    export type Function__4 = (X__5: number) => typeof X__5;
    export type Constructor__4 = new(X__6: number) => {
        value__0: typeof X__6;
    };
    export type Call__4 = {
        (X__7: number) : typeof X__7;
    };
    export type Construct__4 = {
        new(X__8: number): {
            value__0: typeof X__8;
        };
    };
    export type Method__4 = {
        method__0(X__9: number): typeof X__9;
    };
    export type Index__4 = {
        [X__10: string]: typeof X__10;
    };
    export type Rest__4 = (...X__11: number[]) => typeof X__11;
    export type ObjectPattern__4 = ({ X__12 }: {
        X__0: number;
    }) => typeof X__12;
    export type ArrayPattern__4 = ([X__13]: number[]) => typeof X__13;
    export type Annotation__4 = (X__14: X__2) => typeof X__14;
    export type Forward__4 = (first__15: typeof X__15, X__15: number) => typeof X__15;
    export type Computed__4 = {
        [X__3]<X__16>(value__16: X__16): X__16;
    };
    export type Instantiation__4 = typeof create__2<X__2>;
    export const y__4 = X__3;
}
declare function create__2<T__17>(value__17: T__17): T__17;
