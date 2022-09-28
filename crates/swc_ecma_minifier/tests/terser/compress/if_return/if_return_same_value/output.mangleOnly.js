function r() {
    if (foo) {
        return x();
    }
    if (bar) {
        return x();
    }
}
function n() {
    if (foo) {
        return x();
    }
    if (bar) {
        return x();
    }
    return x();
}
function f() {
    if (foo) {
        return x();
    }
    if (bar) {
        return x();
    }
    return y();
}
