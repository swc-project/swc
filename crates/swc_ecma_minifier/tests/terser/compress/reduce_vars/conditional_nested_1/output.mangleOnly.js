var a = 1, b = 0;
(function c(d) {
    function e() {
        d && (d.a = 0);
        d && (d.a = 0);
        d && (d[b++] *= 0);
    }
    e(a-- && c(e((d = 42))));
})();
console.log(b);
