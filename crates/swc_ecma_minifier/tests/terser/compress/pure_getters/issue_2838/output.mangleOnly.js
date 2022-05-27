function b(a, c) {
    (a || c).c = "PASS";
    (function() {
        return b(a, c);
    }.prototype.foo = "bar");
}
var a = {};
b(null, a);
console.log(a.c);
