function a(o) {
    var a = o.a;
    o.b = "PASS";
    o.c;
}
var o = {};
o.d;
a(o);
console.log(o.b);
