!(function() {
    function n(o) {
        console.log("foo", o);
        if (o) f(o - 1);
    }
    function f(n) {
        console.log("bar", n);
        if (n) o(n - 1);
    }
    function o(o) {
        console.log("qux", o);
        if (o) n(o - 1);
    }
    o(4);
})();
