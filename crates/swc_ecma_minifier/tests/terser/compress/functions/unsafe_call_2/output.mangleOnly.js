function c() {
    console.log(a, b);
}
var d = (function(c, d) {
    console.log(this, c, d);
})(function() {
    c.call("foo", "bar");
    d.call("foo", "bar");
})();
