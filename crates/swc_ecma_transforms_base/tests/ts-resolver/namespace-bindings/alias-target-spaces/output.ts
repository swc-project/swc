interface X__2 {
    outer__0: true;
}
interface F__2 {
    outer__0: true;
}
interface M__2 {
    outer__0: true;
}
interface Q__2 {
    outer__0: true;
}
namespace Source__2 {
    export const value__3 = 1;
    export function fn__3() {}
    export interface Shape__3 {
        inner__0: true;
    }
    export class Model__3 {
        inner = true;
    }
    export interface Pair__3 {
        inner__0: true;
    }
    export const Pair__3 = 1;
    export enum E__3 {
        A__0 = 1
    }
    export namespace Types__3 {
        export interface Shape__5 {
            inner__0: true;
        }
    }
}
namespace N__2 {
    export import X__6 = Source__2.value;
    export import F__6 = Source__2.fn;
    export import T__6 = Source__2.Shape;
    export import C__6 = Source__2.Model;
    export import P__6 = Source__2.Pair;
    export import M__6 = Source__2.E.A;
    export import Q__6 = Source__2.Types;
}
namespace N__2 {
    export type Value__7 = X__2;
    export type Function__7 = F__2;
    export type Interface__7 = T__6;
    export type Class__7 = C__6;
    export type Merged__7 = P__6;
    export type Member__7 = M__2;
    export type Qualified__7 = Q__6.Shape;
    export type Namespace__7 = Q__2;
    export type Query__7 = typeof X__6;
    export const value__7 = X__6;
    export const instance__7 = new C__6();
}
