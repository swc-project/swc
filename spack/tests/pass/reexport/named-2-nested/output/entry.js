const c = 1;
console.log('c', c);
console.log('b');
console.log('a');
console.log('entry');
const c1 = c;
const b = c1;
const b1 = b;
export { b1 as a };
