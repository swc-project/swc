const a1 = 1;
export { a1 as a };
const a2 = a1;
const a3 = a2;
const b1 = 2;
export { b1 as b };
const c1 = 3;
export { c1 as c };
console.log(a3);
