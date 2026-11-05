interface X { outer: true }
interface F { outer: true }
interface M { outer: true }
interface Q { outer: true }
namespace Source {
    export const value = 1;
    export function fn() {}
    export interface Shape { inner: true }
    export class Model { inner = true; }
    export interface Pair { inner: true }
    export const Pair = 1;
    export enum E { A = 1 }
    export namespace Types { export interface Shape { inner: true } }
}
namespace N {
    export import X = Source.value;
    export import F = Source.fn;
    export import T = Source.Shape;
    export import C = Source.Model;
    export import P = Source.Pair;
    export import M = Source.E.A;
    export import Q = Source.Types;
}
namespace N {
    export type Value = X;
    export type Function = F;
    export type Interface = T;
    export type Class = C;
    export type Merged = P;
    export type Member = M;
    export type Qualified = Q.Shape;
    export type Namespace = Q;
    export type Query = typeof X;
    export const value = X;
    export const instance = new C();
}
