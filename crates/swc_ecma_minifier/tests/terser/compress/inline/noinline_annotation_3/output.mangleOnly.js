(function() {
    function i(n) {
        return n;
    }
    function n() {
        var n = 1;
        n = i(n);
        window.data = n;
    }
    window.bar = n;
    n();
})();
