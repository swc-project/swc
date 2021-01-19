var c = "PASS";
(function (a, b) {
    (function (d) {
        d[0] = 1;
    })(b);
    a == b && (c = "FAIL");
})("", []);
console.log(c);
