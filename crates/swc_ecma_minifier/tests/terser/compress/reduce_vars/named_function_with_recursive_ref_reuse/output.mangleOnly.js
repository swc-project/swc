var a = [];
var n = function n() {
    a.push(n);
};
[
    0,
    1
].map(()=>n());
console.log(a[0] === a[1]);
