namespace N {
    export const A = 100;
    export enum E { A = 1, B = A + 1 }
}
namespace N {
    export const result = E.B;
}
console.log(N.result);
