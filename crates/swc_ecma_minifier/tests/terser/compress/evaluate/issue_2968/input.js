var c = "FAIL";
(function () {
    (function (a, b) {
        a <<= 0;
        a && (a[((c = "PASS"), 0 >>> (b += 1))] = 0);
    })(42, -42);
})();
console.log(c);
