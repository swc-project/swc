namespace N { export const enum E { A = 5, B } }
import A = N.E;
import B = A;
const value = B.B;
