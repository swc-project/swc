var a = "PASS";
(function(b, c) {
    (function(a) {
        a[0] = 1;
    })(c);
    b == c && (a = "FAIL");
})("", []);
console.log(a);
