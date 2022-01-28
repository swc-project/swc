function f() {
    if (foo) {
        return x();
    }
    if (bar) {
        return x();
    }
}
function g() {
    if (foo) {
        return x();
    }
    if (bar) {
        return x();
    }
    return x();
}
function h() {
    if (foo) {
        return x();
    }
    if (bar) {
        return x();
    }
    return y();
}
