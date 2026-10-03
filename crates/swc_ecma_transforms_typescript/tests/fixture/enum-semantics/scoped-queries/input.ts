const enum A { V = 1 }
const enum B { V = 2 }
const enum C { V = 3 }
const enum D { V = 4 }
const enum E { V = 5 }
const enum F { V = 6 }

function first() {
    const enum A { V = 11 }
    return A.V;
}
function second() {
    const enum A { V = 13 }
    return A.V;
}
function third() {
    const enum A { V = 17 }
    return A.V;
}
function fourth() {
    const enum A { V = 19 }
    return A.V;
}
function fifth() {
    const enum A { V = 23 }
    return A.V;
}

namespace Values {
    export const enum A { V = 29 }
    export namespace Child {
        export const enum A { V = 31 }
    }
}

import Leaf = Values.Child.A.V;

export const results = [
    A.V, B["V"], C.V, D.V, E.V, F.V,
    first(), second(), third(), fourth(), fifth(),
    Values.A.V, Leaf,
];
