(function () {
    function n(n) {
        return n;
    }
    function i() {
        var i = 1;
        i = n(i);
        window.data = i;
    }
    window.bar = i;
    i();
})();
