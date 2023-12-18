var n = "FAIL";
(function() {
    (function(n, o) {
        n <<= 0;
        n && (n[((n = "PASS"), 0 >>> (o += 1))] = 0);
    })(42, -42);
})();
console.log(n);
