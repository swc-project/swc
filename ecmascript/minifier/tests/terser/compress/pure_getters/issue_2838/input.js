function f(a, b) {
    (a || b).c = "PASS";
    (function () {
        return f(a, b);
    }.prototype.foo = "bar");
}
var o = {};
f(null, o);
console.log(o.c);
