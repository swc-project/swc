var g = "PASS";
(function(f) {
    var g = "FAIL";
    f("console.log(g)", g[g]);
})(function(a) {
    eval(a);
});
