var b = 2, a = 0;
(function c(d) {
    0 < b-- && e((d = 1));
    function e() {
        d && a++;
    }
    e();
    0 < b-- && c();
})();
console.log(a);
