(function(f) {
    f("g()");
})(function(a) {
    eval(a);
    function g(b) {
        if (!b) b = "PASS";
        console.log(b);
    }
});
