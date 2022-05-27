var b = 1, a = 0;
(function d(e) {
    function c() {
        e && (e.a = 0);
        e && (e.a = 0);
        e && (e[a++] *= 0);
    }
    c(b-- && d(c((e = 42))));
})();
console.log(a);
