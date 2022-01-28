(function (n, o = "FAIL") {
    console.log(n);
})("PASS");
(function (n, o = "PASS") {
    console.log(o);
})("FAIL");
(function (o = "PASS") {
    console.log(o);
})();
(function (n, { o: o = "FAIL" }) {
    console.log(n);
})("PASS", {});
