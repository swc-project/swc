function f(a) {
    a.b = "PASS";
}
var o = {};
f(o);
console.log(o.b);
