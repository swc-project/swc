const b = 1;
const __default = b;
console.log('b');
const a1 = __default;
console.log('a.js');
export { a1 as a };
console.log('entry');
