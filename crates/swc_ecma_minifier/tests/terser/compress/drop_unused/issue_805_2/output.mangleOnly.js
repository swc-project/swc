(function (o) {
    function n() {}
    n.prototype[o()] = 42;
    (n.prototype.bar = function () {
        console.log("bar");
    })();
    return n;
})(function () {
    console.log("foo");
    return "foo";
});
