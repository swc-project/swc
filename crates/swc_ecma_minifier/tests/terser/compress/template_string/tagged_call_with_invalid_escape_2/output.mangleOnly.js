var a = {
    y: ()=>String.raw
};
console.log(a.y()`\4321\u\x`);
let b = ()=>String.raw;
console.log(b()`\4321\u\x`);
