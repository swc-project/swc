class b {
}
console.log('b', b);
const b1 = b;
const b2 = b1;
console.log('a');
export { b2 as a };
