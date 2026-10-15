interface X { outer: true; }
namespace N {
    export const X = 1;
    export class C {}
    export enum E { A }
}
namespace N {
    export type Outer = X;
    export type Value = typeof X;
    export type ClassType = C;
    export type ClassValue = typeof C;
    export type EnumType = E;
    export type EnumValue = typeof E;
    export const y = X;
}

namespace Outer {
    export interface X { parent: true; }
    export namespace Inner { export const X = 2; }
    export namespace Inner {
        export type Type = X;
        export type Value = typeof X;
    }
}
