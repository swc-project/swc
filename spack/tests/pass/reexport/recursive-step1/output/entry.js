const c = 'c';
console.log('c');
const b = c;
const __default = b;
console.log('b');
const b1 = __default;
console.log('a.js');
export { b1 as b };
console.log('entry');
