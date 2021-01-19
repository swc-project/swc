console.log(
    (function () {
        return f;
        function f(n) {
            function g(i) {
                return i && i + g(i - 1);
            }
            function h(j) {
                return g(j);
            }
            return h(n);
        }
    })()(5)
);
