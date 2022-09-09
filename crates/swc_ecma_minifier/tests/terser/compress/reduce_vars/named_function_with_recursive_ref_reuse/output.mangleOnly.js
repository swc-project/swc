var o = [];
var a = function a() {
    o.push(a);
};
[0, 1].map(() => a());
console.log(o[0] === o[1]);
