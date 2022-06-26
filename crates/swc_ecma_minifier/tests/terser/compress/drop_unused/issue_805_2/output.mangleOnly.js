(function(a) {
    function b() {}
    b.prototype[a()] = 42;
    (b.prototype.bar = function() {
        console.log("bar");
    })();
    return b;
})(function() {
    console.log("foo");
    return "foo";
});
