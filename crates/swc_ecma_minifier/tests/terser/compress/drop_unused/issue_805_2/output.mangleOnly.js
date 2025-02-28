(function(n) {
    function o() {}
    o.prototype[n()] = 42;
    (o.prototype.bar = function() {
        console.log("bar");
    })();
    return o;
})(function() {
    console.log("foo");
    return "foo";
});
