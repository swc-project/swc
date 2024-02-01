function f() {
    return function(b) {
        return 2;
    }(0) + function h() {
        return h();
    }();
}
