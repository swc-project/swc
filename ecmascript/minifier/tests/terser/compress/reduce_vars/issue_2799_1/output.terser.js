console.log(
    (function () {
        return function (n) {
            function g(i) {
                return i && i + g(i - 1);
            }
            return (function (j) {
                return g(j);
            })(n);
        };
    })()(5)
);
