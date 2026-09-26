namespace Outer {
    export interface I {}
}

namespace N {
    export import type A = Outer;
}

namespace N {
    export type T = A.I;
}
