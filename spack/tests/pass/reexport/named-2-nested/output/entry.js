const c = 1;
console.log('c', c);
const b = c;
console.log('b');
const b1 = b;
console.log('a');
export { b1 as a };
console.log('entry');
