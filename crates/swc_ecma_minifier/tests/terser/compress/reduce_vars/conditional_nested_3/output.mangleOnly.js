var n = 2,
    o = 0;
(function c(f) {
    0 < n-- && i((f = 1));
    function i() {
        f && o++;
    }
    i();
    0 < n-- && c();
})();
console.log(o);
