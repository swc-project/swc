var a = [];
var b = function b() {
    a.push(b);
};
[
    0,
    1
].map(()=>b());
console.log(a[0] === a[1]);
