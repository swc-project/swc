var n, o;
function c() {
    n = function () {};
    o = function () {};
    return function () {};
}
var t = c();
console.log(n === o, o === t, t === n);
