function f(x) {
    return function () {
        function n(a) {
            return a * a;
        }
        return x(n);
    };
}
