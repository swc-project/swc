const enum E {
    A = 1,
}
const enum E {
    B = A as number,
}
const enum E {
    C = 2,
}
const enum E {
    D = C as number,
}
if (E.B !== 1 || E.D !== 2) {
    throw new Error("Merged const enum members lost their values");
}
