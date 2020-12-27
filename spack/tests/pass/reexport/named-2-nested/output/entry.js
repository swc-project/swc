const c = 1;
console.log('c', c);
const c1 = c;
const b = c1;
console.log('b');
const b1 = b;
console.log('a');
export { b1 as a };
console.log('entry');
