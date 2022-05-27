!(function() {
    function c(b) {
        console.log("foo", b);
        if (b) a(b - 1);
    }
    function a(a) {
        console.log("bar", a);
        if (a) b(a - 1);
    }
    function b(a) {
        console.log("qux", a);
        if (a) c(a - 1);
    }
    b(4);
    a(5);
})();
