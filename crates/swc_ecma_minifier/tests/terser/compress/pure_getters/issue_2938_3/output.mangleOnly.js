function o(o) {
    var a = o.a;
    o.b = "PASS";
    o.c;
}
var a = {};
a.d;
o(a);
console.log(a.b);
