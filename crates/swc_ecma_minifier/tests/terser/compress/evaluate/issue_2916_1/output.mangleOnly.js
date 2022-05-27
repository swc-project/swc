var a = "PASS";
(function(c, b) {
    (function(a) {
        a[0] = 1;
    })(b);
    c == b && (a = "FAIL");
})("", []);
console.log(a);
