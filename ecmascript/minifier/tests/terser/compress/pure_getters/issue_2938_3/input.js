function f(a) {
    var unused = a.a;
    a.b = "PASS";
    a.c;
}
var o = {};
o.d;
f(o);
console.log(o.b);
