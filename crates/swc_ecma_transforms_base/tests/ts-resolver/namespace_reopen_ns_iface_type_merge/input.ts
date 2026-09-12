namespace A {
    export namespace B {
        export const c = 1;
        export type T = number;
    }
    export let v: B;
    export let w: B.T;
}
namespace A {
    export interface B { z: number }
}
