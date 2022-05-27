(function(a) {
    a("g()");
})(function(a) {
    eval(a);
    function g(b) {
        if (!b) b = "PASS";
        console.log(b);
    }
});
