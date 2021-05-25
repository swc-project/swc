var a = 1,
    b = 0;
(function f(c) {
    function g() {
        c && (c.a = 0);
        c && (c.a = 0);
        c && (c[b++] *= 0);
    }
    g(a-- && f(g((c = 42))));
})();
console.log(b);
