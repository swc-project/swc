function f(r) {
    return function () {
        function n(r) {
            return r * r;
        }
        return r(n);
    };
}
