function b() {
    console.log(b);
}
console.log('b', b);
console.log('a');
export { b as a };
