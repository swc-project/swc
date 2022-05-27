(function(a, b = "FAIL") {
    console.log(a);
})("PASS");
(function(b, a = "PASS") {
    console.log(a);
})("FAIL");
(function(a = "PASS") {
    console.log(a);
})();
(function(a, { o: b = "FAIL"  }) {
    console.log(a);
})("PASS", {});
