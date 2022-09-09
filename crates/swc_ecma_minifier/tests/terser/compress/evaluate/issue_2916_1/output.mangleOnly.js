var n = "PASS";
(function (o, c) {
    (function (n) {
        n[0] = 1;
    })(c);
    o == c && (n = "FAIL");
})("", []);
console.log(n);
