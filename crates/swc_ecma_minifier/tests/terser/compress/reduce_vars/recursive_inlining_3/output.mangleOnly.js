!(function() {
    function b(a) {
        console.log("foo", a);
        if (a) c(a - 1);
    }
    function c(b) {
        console.log("bar", b);
        if (b) a(b - 1);
    }
    function a(a) {
        console.log("qux", a);
        if (a) b(a - 1);
    }
    a(4);
})();
