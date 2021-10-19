function f1(t1, t2, t3, t4, x) {
    let [d10, d11, d12] = t1; // string, number
    let [d20, d21, d22] = t2; // string | boolean, number | undefined
    let [d30, d31, d32] = t3; // string, number, number
    let [d40, d41, d42] = t4; // string | boolean, number | undefined, number | undefined
    [d10, d11, d12] = t1;
    [d20, d21, d22] = t2;
    [d30, d31, d32] = t3;
    [d40, d41, d42] = t4;
    let t10 = t1[0]; // string
    let t11 = t1[1]; // number
    let t12 = t1[2]; // undefined
    let t1x = t1[x]; // string | number
    let t20 = t2[0]; // string | boolean
    let t21 = t2[1]; // number | undefined
    let t22 = t2[2]; // undefined
    let t2x = t2[x]; // string | number | boolean
    let t30 = t3[0]; // string
    let t31 = t3[1]; // number
    let t32 = t3[2]; // number
    let t3x = t3[x]; // string | number
    let t40 = t4[0]; // string | boolean
    let t41 = t4[1]; // number | undefined
    let t42 = t4[2]; // number | undefined
    let t4x = t4[x]; // string | number | boolean
    t1[1] = 42;
    t2[1] = 42;
    t3[1] = 42;
    t4[1] = 42;
}
const ex = [
    "hi"
];
const [x, y] = ex;
