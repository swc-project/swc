function f(t) {
    return function () {
        function r(t) {
            return t * t;
        }
        return function () {
            function n(t) {
                return t * t;
            }
            return t(n);
        };
    };
}
