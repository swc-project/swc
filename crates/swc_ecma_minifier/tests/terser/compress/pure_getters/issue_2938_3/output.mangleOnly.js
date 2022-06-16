function a(a) {
    var b = a.a;
    a.b = "PASS";
    a.c;
}
var b = {};
b.d;
a(b);
console.log(b.b);
