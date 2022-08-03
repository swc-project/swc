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
function t() {
    if (foo) {
        return x();
    }
    if (bar) {
        return x();
    }
    return y();
}
