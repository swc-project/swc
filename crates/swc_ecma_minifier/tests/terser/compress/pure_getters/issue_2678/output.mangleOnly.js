var n = 1, r = "FAIL";
(function t() {
    (n-- && t()).p;
    return {
        get p () {
            r = "PASS";
        }
    };
})();
console.log(r);
