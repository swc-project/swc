(function() {
    function b(a) {
        return a;
    }
    function a() {
        var a = 1;
        a = b(a);
        window.data = a;
    }
    window.bar = a;
    a();
})();
