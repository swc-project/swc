namespace N { export enum E { A = 1, B } }
N.E.A = 5;
const read = N.E.A;
const enum E { A = 7 }
const folded = E.A;
const annotated = (N.E.A as number);
