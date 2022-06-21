var a = 2, b = 0;
(function c(d) {
    0 < a-- && e((d = 1));
    function e() {
        d && b++;
    }
    e();
    0 < a-- && c();
})();
console.log(b);
