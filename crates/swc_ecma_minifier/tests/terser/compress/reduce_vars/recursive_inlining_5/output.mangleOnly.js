!(function() {
    function o(o) {
        console.log("foo", o);
        if (o) f(o - 1);
    }
    function f(o) {
        console.log("bar", o);
        if (o) n(o - 1);
    }
    function n(f) {
        console.log("qux", f);
        if (f) o(f - 1);
    }
    n(4);
    f(5);
    o(3);
})();
