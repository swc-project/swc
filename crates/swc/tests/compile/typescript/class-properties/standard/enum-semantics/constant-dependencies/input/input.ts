const source = 10;
const intermediate = source + 2;
const enum Dependent { A = intermediate, B }
export const results = [Dependent.A, Dependent.B];
