var n = "PASS";
(function(c, o) {
    (function(n) {
        n[0] = 1;
    })(o);
    c == o && (n = "FAIL");
})("", []);
console.log(n);
