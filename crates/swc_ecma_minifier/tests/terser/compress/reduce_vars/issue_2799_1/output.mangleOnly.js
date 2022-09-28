console.log((function() {
    return n;
    function n(n) {
        function r(n) {
            return n && n + r(n - 1);
        }
        function t(n) {
            return r(n);
        }
        return t(n);
    }
})()(5));
