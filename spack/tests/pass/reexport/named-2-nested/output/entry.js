const c = 1;
const c1 = c;
console.log('c', c);
const b = c1;
console.log('b');
const b1 = b;
console.log('a');
export { b1 as a };
console.log('entry');
