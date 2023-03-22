(function(f1) {
    f1("g()");
})(function(a) {
    eval(a);
    function g(b1) {
        if (!b1) b1 = "PASS";
        console.log(b1);
    }
});
