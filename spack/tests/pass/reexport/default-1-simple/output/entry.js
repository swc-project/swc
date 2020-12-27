const b = 1;
console.log('b');
const __default = b;
const a1 = __default;
console.log('a.js');
export { a1 as a };
console.log('entry');
