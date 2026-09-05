namespace N {
    export const x = foo;
}
namespace N {
    export function foo() { return 1; }
    export namespace foo { export interface Options {} }
}
namespace M {
    export const before = B;
}
namespace M {
    export namespace B {
        export interface I {}
    }
    export namespace B {
        export const c = 1;
    }
}
