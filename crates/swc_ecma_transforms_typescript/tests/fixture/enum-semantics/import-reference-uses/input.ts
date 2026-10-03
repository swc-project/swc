import { runtime, shadowed, unused } from "values";

const enum Constant {
    A = 7,
}

function read(shadowed: number) {
    return shadowed + Constant.A;
}

enum Dynamic {
    A = runtime,
}

export const result = runtime + read(3);
export const shorthand = { runtime };
export { runtime as exported };
