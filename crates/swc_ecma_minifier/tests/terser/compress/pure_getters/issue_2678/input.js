var a = 1,
    c = "FAIL";
(function f() {
    (a-- && f()).p;
    return {
        get p() {
            c = "PASS";
        },
    };
})();
console.log(c);
