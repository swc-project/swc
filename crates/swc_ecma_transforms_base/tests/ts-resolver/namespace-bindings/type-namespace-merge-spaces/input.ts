interface X { outer: true }
namespace N {
    export namespace X { export interface Item { inner: true } }
}
namespace N { export interface X { inner: true } }
namespace N {
    export type Plain = X;
    export type Qualified = X.Item;
    export import Alias = X;
    export type Aliased = Alias;
    export type AliasedQualified = Alias.Item;
}
namespace Reverse { export interface X { inner: true } }
namespace Reverse {
    export namespace X { export interface Item { inner: true } }
}
namespace Reverse {
    export type Plain = X;
    export type Qualified = X.Item;
}
