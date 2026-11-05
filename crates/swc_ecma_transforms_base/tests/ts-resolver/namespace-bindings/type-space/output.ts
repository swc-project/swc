interface X__2 {
    outer__0: true;
}
namespace N__2 {
    export const X__3 = 1;
    export class C__3 {
    }
    export enum E__3 {
        A__0
    }
}
namespace N__2 {
    export type Outer__4 = X__2;
    export type Value__4 = typeof X__3;
    export type ClassType__4 = C__3;
    export type ClassValue__4 = typeof C__3;
    export type EnumType__4 = E__3;
    export type EnumValue__4 = typeof E__3;
    export const y__4 = X__3;
}
namespace Outer__2 {
    export interface X__5 {
        parent__0: true;
    }
    export namespace Inner__5 {
        export const X__6 = 2;
    }
    export namespace Inner__5 {
        export type Type__7 = X__5;
        export type Value__7 = typeof X__6;
    }
}
