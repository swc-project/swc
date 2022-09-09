function o(o) {
    do {
        (function () {
            o && (n = "PASS");
        })();
    } while ((o = 0));
}
var n = "FAIL";
o(1);
console.log(n);
