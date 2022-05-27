function b(a) {
    var b = a.a;
    a.b = "PASS";
    a.c;
}
var a = {};
a.d;
b(a);
console.log(a.b);
