function n(o, c) {
    (o || c).c = "PASS";
    (function() {
        return n(o, c);
    }.prototype.foo = "bar");
}
var o = {};
n(null, o);
console.log(o.c);
