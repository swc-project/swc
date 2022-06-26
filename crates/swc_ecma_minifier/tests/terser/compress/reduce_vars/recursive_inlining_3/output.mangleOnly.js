!(function() {
    function a(a) {
        console.log("foo", a);
        if (a) b(a - 1);
    }
    function b(a) {
        console.log("bar", a);
        if (a) c(a - 1);
    }
    function c(b) {
        console.log("qux", b);
        if (b) a(b - 1);
    }
    c(4);
})();
