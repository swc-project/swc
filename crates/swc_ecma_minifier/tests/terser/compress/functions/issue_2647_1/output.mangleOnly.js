(function (o, n = "FAIL") {
    console.log(o);
})("PASS");
(function (o, n = "PASS") {
    console.log(n);
})("FAIL");
(function (o = "PASS") {
    console.log(o);
})();
(function (o, { o: n = "FAIL" }) {
    console.log(o);
})("PASS", {});
