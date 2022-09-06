var n = 1,
    o = "FAIL";
(function e() {
    (n-- && e()).p;
    return {
        get p() {
            o = "PASS";
        },
    };
})();
console.log(o);
