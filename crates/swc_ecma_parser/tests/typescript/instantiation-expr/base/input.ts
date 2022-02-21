var ss = new SS<number>;

const a1 = f<number>;
const a2 = f.g<number>;
const a3 = f<number>.g;
const a4 = f<number>.g<number>;
const a5 = f['g']<number>;
const a9 = (f<number>)<number>;
