const c = 'c';
console.log('c');
const c1 = c, b2 = c1;
const __default = b2;
console.log('b');
const b1 = __default;
console.log('a.js');
export { b1 as b };
console.log('entry');
