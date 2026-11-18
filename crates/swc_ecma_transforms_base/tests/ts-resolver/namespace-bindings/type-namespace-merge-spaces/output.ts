interface X__2 {
    outer__0: true;
}
namespace N__2 {
    export namespace X__3 {
        export interface Item__4 {
            inner__0: true;
        }
    }
}
namespace N__2 {
    export interface X__5 {
        inner__0: true;
    }
}
namespace N__2 {
    export type Plain__6 = X__5;
    export type Qualified__6 = X__5.Item;
    export import Alias__6 = X__5;
    export type Aliased__6 = Alias__6;
    export type AliasedQualified__6 = Alias__6.Item;
}
namespace Reverse__2 {
    export interface X__7 {
        inner__0: true;
    }
}
namespace Reverse__2 {
    export namespace X__8 {
        export interface Item__9 {
            inner__0: true;
        }
    }
}
namespace Reverse__2 {
    export type Plain__10 = X__7;
    export type Qualified__10 = X__7.Item;
}
