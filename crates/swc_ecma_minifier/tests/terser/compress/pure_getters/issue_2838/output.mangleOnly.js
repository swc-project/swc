function a(b, c) {
    (b || c).c = "PASS";
    (function() {
        return a(b, c);
    }.prototype.foo = "bar");
}
var b = {};
a(null, b);
console.log(b.c);
