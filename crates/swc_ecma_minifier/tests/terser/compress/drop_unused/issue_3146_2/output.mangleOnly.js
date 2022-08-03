(function(n) {
    n("g()");
})(function(a) {
    eval(a);
    function g(n) {
        if (!n) n = "PASS";
        console.log(n);
    }
});
