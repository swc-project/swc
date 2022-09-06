!(function () {
    function o(o) {
        console.log("foo", o);
        if (o) n(o - 1);
    }
    function n(o) {
        console.log("bar", o);
        if (o) f(o - 1);
    }
    function f(n) {
        console.log("qux", n);
        if (n) o(n - 1);
    }
    f(4);
})();
