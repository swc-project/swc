function n(n) {
    return function () {
        function r(n) {
            return n * n;
        }
        return [
            function () {
                function n(n) {
                    return n * n;
                }
                return n;
            },
            function () {
                function r(n) {
                    return n * n;
                }
                return n(r);
            },
        ];
    };
}
