var x = { y: () => String.raw };
console.log(x.y()`\4321\u\x`);
let z = () => String.raw;
console.log(z()`\4321\u\x`);
