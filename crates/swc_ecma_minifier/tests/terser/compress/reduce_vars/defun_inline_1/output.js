function f() {
    return function() {
        return 2;
    }(2) + function h() {
        return h();
    }();
}
