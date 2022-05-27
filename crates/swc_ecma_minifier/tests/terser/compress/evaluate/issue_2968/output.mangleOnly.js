var a = "FAIL";
(function() {
    (function(b, c) {
        b <<= 0;
        b && (b[((a = "PASS"), 0 >>> (c += 1))] = 0);
    })(42, -42);
})();
console.log(a);
