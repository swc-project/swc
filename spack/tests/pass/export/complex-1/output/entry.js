const b2 = '1';
const a2 = '1';
const a1 = a2;
const b1 = b2;
export { a1 as a };
export { b1 as b };
const b3 = b1;
console.log(b3);
