(function(b) {
    function a() {}
    a.prototype[b()] = 42;
    (a.prototype.bar = function() {
        console.log("bar");
    })();
    return a;
})(function() {
    console.log("foo");
    return "foo";
});
