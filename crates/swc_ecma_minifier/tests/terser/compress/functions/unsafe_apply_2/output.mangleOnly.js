function c() {
    console.log(a, b);
}
var d = (function(c, d) {
    console.log(this, c, d);
})(function() {
    c.apply("foo", [
        "bar"
    ]);
    d.apply("foo", [
        "bar"
    ]);
})();
