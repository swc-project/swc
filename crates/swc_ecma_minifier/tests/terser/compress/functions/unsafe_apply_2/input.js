function foo() {
    console.log(a, b);
}
var bar = (function (a, b) {
    console.log(this, a, b);
})(function () {
    foo.apply("foo", ["bar"]);
    bar.apply("foo", ["bar"]);
})();
