var g = "PASS";
(function(f) {
    var g1 = "FAIL";
    f("console.log(g)", g1[g1]);
})(function(a) {
    eval(a);
});
