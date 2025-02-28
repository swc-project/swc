var o = 1, n = 0;
(function a(f) {
    function c() {
        f && (f.a = 0);
        f && (f.a = 0);
        f && (f[n++] *= 0);
    }
    c(o-- && a(c((f = 42))));
})();
console.log(n);
