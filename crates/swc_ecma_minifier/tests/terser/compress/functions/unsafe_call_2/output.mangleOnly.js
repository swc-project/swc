function o() {
    console.log(a, b);
}
var l = (function(o, l) {
    console.log(this, o, l);
})(function() {
    o.call("foo", "bar");
    l.call("foo", "bar");
})();
