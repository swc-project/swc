namespace Outer {
    export const x = 1;
}

namespace N {
    export import A = Outer;
}

namespace N {
    export const b = A.x + 1;
}
