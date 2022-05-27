var b = 1, a = "FAIL";
(function c() {
    (b-- && c()).p;
    return {
        get p () {
            a = "PASS";
        }
    };
})();
console.log(a);
