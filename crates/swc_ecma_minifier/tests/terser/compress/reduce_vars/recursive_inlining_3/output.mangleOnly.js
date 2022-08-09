!(function() {
    function n(n) {
        console.log("foo", n);
        if (n) f(n - 1);
    }
    function f(n) {
        console.log("bar", n);
        if (n) i(n - 1);
    }
    function i(f) {
        console.log("qux", f);
        if (f) n(f - 1);
    }
    i(4);
})();
