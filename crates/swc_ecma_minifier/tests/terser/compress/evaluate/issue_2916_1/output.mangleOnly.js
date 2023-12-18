var n = "PASS";
(function(n, o) {
    (function(n) {
        n[0] = 1;
    })(o);
    n == o && (n = "FAIL");
})("", []);
console.log(n);
