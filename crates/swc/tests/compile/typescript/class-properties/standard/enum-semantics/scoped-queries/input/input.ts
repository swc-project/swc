const enum A { V = 1 }

function first() {
    const enum A { V = 11 }
    return A.V;
}
function second() {
    const enum A { V = 13 }
    return A.V;
}

namespace Values {
    export const enum A { V = 29 }
    export namespace Child {
        export const enum A { V = 31 }
    }
}

import Leaf = Values.Child.A.V;

namespace Left {
    export namespace Values {
        export enum E { V = 41 }
    }
    export import Alias = Values.E;
    export import Leaf = Values.E.V;
}
namespace Right {
    export namespace Values {
        export enum E { V = 43 }
    }
    export import Alias = Values.E;
    export import Leaf = Values.E.V;
}
namespace Merged {
    export const enum E { A = 47 }
    export const first = E.A;
}
namespace Merged {
    export const enum E { B = 53 }
    export const second = E.B;
}

export const results = [
    A.V,
    first(), second(),
    Values.A.V, Leaf,
    Left.Values.E.V, Left.Alias.V, Left.Leaf, Reflect.get(Left.Alias, "V"),
    Right.Values.E.V, Right.Alias.V, Right.Leaf, Reflect.get(Right.Alias, "V"),
    Merged.first, Merged.second, Merged.E.A, Merged.E.B,
];
