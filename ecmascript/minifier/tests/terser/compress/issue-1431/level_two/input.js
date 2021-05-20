function f(x) {
    return function () {
        function r(a) {
            return a * a;
        }
        return function () {
            function n(a) {
                return a * a;
            }
            return x(n);
        };
    };
}
