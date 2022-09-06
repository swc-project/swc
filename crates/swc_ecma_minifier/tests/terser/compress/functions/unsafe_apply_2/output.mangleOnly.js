function o() {
    console.log(a, b);
}
var n = (function (o, n) {
    console.log(this, o, n);
})(function () {
    o.apply("foo", ["bar"]);
    n.apply("foo", ["bar"]);
})();
