var n = 1,
    o = 0;
(function a(c) {
    function f() {
        c && (c.a = 0);
        c && (c.a = 0);
        c && (c[o++] *= 0);
    }
    f(n-- && a(f((c = 42))));
})();
console.log(o);
