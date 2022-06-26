(function() {
    function a(a) {
        return a;
    }
    function b() {
        var b = 1;
        b = a(b);
        window.data = b;
    }
    window.bar = b;
    b();
})();
