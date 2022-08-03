(function() {
    function n(n) {
        return n;
    }
    function t() {
        var t = 1;
        t = n(t);
        window.data = t;
    }
    window.bar = t;
    t();
})();
