function f(a, b) {
    (a || b).c = "PASS";
}
var o = {};
f(null, o);
console.log(o.c);
