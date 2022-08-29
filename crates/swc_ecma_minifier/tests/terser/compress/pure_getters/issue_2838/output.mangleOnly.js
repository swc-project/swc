function o(n, r) {
    (n || r).c = "PASS";
    (function() {
        return o(n, r);
    }.prototype.foo = "bar");
}
var n = {};
o(null, n);
console.log(n.c);
