(function(o, n = "FAIL") {
    console.log(o);
})("PASS");
(function(n, o = "PASS") {
    console.log(o);
})("FAIL");
(function(o = "PASS") {
    console.log(o);
})();
(function(o, { o: n = "FAIL" }) {
    console.log(o);
})("PASS", {});
