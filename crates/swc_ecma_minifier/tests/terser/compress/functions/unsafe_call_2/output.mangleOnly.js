function l() {
    console.log(a, b);
}
var n = (function(l, n) {
    console.log(this, l, n);
})(function() {
    l.call("foo", "bar");
    n.call("foo", "bar");
})();
