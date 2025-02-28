console.log((function() {
    return n;
    function n(n) {
        function t(n) {
            return n && n + t(n - 1);
        }
        function r(n) {
            return t(n);
        }
        return r(n);
    }
})()(5));
