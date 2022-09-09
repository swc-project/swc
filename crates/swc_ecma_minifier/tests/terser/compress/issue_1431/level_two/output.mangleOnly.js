function n(n) {
    return function () {
        function r(n) {
            return n * n;
        }
        return function () {
            function r(n) {
                return n * n;
            }
            return n(r);
        };
    };
}
