function o(n, t) {
    (n || t).c = "PASS";
    (function() {
        return o(n, t);
    }.prototype.foo = "bar");
}
var n = {};
o(null, n);
console.log(n.c);
