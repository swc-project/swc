const c = 1;
console.log('c', c);
const b = c;
console.log('b');
const a1 = b;
console.log('a');
export { a1 as a };
console.log('entry');
