!(function() {
    function f(n) {
        console.log("foo", n);
        if (n) o(n - 1);
    }
    function o(o) {
        console.log("bar", o);
        if (o) n(o - 1);
    }
    function n(o) {
        console.log("qux", o);
        if (o) f(o - 1);
    }
    n(4);
    o(5);
})();
