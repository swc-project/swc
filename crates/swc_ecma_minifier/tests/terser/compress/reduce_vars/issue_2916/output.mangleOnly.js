var n = "FAIL";
(function(n) {
    (function(n) {
        n[0] = 1;
    })(n);
    +n && (n = "PASS");
})([]);
console.log(n);
