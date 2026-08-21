type C = string;
namespace N {
    export let v: C;
    export type W = C2.Q;
}
namespace N {
    export namespace C { export const q = 1; }
    export namespace C2 { export type Q = number; }
}
