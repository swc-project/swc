function n() {
    console.log(a, b);
}
var o = (function(n, o) {
    console.log(this, n, o);
})(function() {
    n.apply("foo", [
        "bar"
    ]);
    o.apply("foo", [
        "bar"
    ]);
})();
