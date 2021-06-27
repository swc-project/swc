var { w: o, ...l } = { w: 7, x: 1, y: 2 };
console.log(o, l);
let { w: c, ...n } = { w: 8, x: 3, y: 4 };
console.log(c, n);
const { w: e, ...s } = { w: 9, x: 5, y: 6 };
console.log(e, s);
let g;
({ b: g, ...l } = { a: 1, b: 2, c: 3 });
console.log(l);
({ b: g, ...n } = { a: 4, b: 5, c: 6 });
console.log(n);
(function ({ y: o, ...l }) {
    console.log(l);
})({ x: 1, y: 2, z: 3 });
(({ y: o, ...l }) => {
    console.log(l);
})({ x: 4, y: 5, z: 6 });
const w = { a: 1, b: 2 };
console.log({ ...w, w: 0, ...n, K: 9 });
