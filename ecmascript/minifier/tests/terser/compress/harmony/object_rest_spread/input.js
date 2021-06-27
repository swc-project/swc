var { w: w1, ...V } = { w: 7, x: 1, y: 2 };
console.log(w1, V);
let { w: w2, ...L } = { w: 8, x: 3, y: 4 };
console.log(w2, L);
const { w: w3, ...C } = { w: 9, x: 5, y: 6 };
console.log(w3, C);
let b;
({ b: b, ...V } = { a: 1, b: 2, c: 3 });
console.log(V);
({ b: b, ...L } = { a: 4, b: 5, c: 6 });
console.log(L);
(function ({ y: y, ...p }) {
    console.log(p);
})({ x: 1, y: 2, z: 3 });
(({ y: y, ...p }) => {
    console.log(p);
})({ x: 4, y: 5, z: 6 });
const T = { a: 1, b: 2 };
console.log({ ...T, w: 0, ...{}, ...L, ...{ K: 9 } });
