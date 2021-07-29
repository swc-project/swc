(function(f) {
    f("g()");
})(function(a) {
    function g(b) {
        if (!b) b = "PASS";
        console.log(b);
    }
    eval(a);
});
