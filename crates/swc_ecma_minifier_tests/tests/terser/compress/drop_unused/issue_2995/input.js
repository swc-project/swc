function f(a) {
    var b;
    a.b = b = function () {};
    b.c = "PASS";
}
var o = {};
f(o);
console.log(o.b.c);
