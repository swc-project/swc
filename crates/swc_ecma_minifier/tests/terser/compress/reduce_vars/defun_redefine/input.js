function f() {
    function g() {
        return 1;
    }
    function h() {
        return 2;
    }
    g = function () {
        return 3;
    };
    return g() + h();
}
