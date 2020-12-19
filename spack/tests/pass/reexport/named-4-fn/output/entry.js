function b() {
    console.log(b);
}
console.log('b', b);
console.log('a');
const b1 = b;
const b2 = b1;
export { b2 as a };
