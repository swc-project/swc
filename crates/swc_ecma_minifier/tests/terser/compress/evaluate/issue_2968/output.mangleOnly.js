var n = "FAIL";
(function () {
    (function (o, c) {
        o <<= 0;
        o && (o[((n = "PASS"), 0 >>> (c += 1))] = 0);
    })(42, -42);
})();
console.log(n);
