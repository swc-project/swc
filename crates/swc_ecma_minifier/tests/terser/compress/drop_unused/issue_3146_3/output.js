var g = "PASS";
(function(f1) {
    var g1 = "FAIL";
    f1("console.log(g)", g1[g1]);
})(function(a) {
    eval(a);
});
