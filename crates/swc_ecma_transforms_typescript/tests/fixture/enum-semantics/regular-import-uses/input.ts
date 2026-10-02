import { runtime, shadowed, unused, typeOnly } from "values";

enum Literal {
    A = 7,
    B = A + 1,
}

enum Dynamic {
    A = runtime,
}

function read(shadowed: number): typeOnly {
    return shadowed + Literal.B;
}

export const result = Dynamic.A + read(3);
export const shorthand = { runtime };
export { runtime as exported };
