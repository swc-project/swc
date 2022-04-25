function f(u) {
    return function () {
        function r(u) {
            return u * u;
        }
        return [
            function () {
                function t(u) {
                    return u * u;
                }
                return t;
            },
            function () {
                function n(u) {
                    return u * u;
                }
                return u(n);
            },
        ];
    };
}
