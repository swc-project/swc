var a = 1, b = "FAIL";
(function c() {
    (a-- && c()).p;
    return {
        get p () {
            b = "PASS";
        }
    };
})();
console.log(b);
