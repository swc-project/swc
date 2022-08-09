var n = 1, $ = 0;
(function a(o) {
    function c() {
        o && (o.a = 0);
        o && (o.a = 0);
        o && (o[$++] *= 0);
    }
    c(n-- && a(c((o = 42))));
})();
console.log($);
