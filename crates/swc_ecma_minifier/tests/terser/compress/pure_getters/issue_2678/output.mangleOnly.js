var o = 1, n = "FAIL";
(function e() {
    (o-- && e()).p;
    return {
        get p () {
            n = "PASS";
        }
    };
})();
console.log(n);
