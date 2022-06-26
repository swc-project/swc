(function(a, b = "FAIL") {
    console.log(a);
})("PASS");
(function(a, b = "PASS") {
    console.log(b);
})("FAIL");
(function(a = "PASS") {
    console.log(a);
})();
(function(a, { o: b = "FAIL"  }) {
    console.log(a);
})("PASS", {});
