function o(n, c) {
    (n || c).c = "PASS";
    (function () {
        return o(n, c);
    }.prototype.foo = "bar");
}
var n = {};
o(null, n);
console.log(n.c);
