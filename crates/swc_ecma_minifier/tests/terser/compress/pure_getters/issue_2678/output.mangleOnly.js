var n = 1, o = "FAIL";
(function o() {
    (n-- && o()).p;
    return {
        get p () {
            o = "PASS";
        }
    };
})();
console.log(o);
