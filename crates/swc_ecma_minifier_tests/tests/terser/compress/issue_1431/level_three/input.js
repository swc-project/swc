function f(x) {
    return function () {
        function r(a) {
            return a * a;
        }
        return [
            function () {
                function t(a) {
                    return a * a;
                }
                return t;
            },
            function () {
                function n(a) {
                    return a * a;
                }
                return x(n);
            },
        ];
    };
}
