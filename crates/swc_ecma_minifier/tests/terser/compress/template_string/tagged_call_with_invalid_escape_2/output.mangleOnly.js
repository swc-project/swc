var a = {
    y: ()=>String.raw
};
console.log(a.y()`\4321\u\x`);
let l = ()=>String.raw;
console.log(l()`\4321\u\x`);
