function f(a) {
    function b() {
        return 2;
    }
    b.inject = [];
    (function () {
        return 4;
    });
    return 1 + 2 + 4;
}
