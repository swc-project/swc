(function(a) {
    a("g()");
})(function(a) {
    eval(a);
    function g(a) {
        if (!a) a = "PASS";
        console.log(a);
    }
});
