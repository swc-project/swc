function a() {
    if (foo) {
        return x();
    }
    if (bar) {
        return x();
    }
}
function b() {
    if (foo) {
        return x();
    }
    if (bar) {
        return x();
    }
    return x();
}
function c() {
    if (foo) {
        return x();
    }
    if (bar) {
        return x();
    }
    return y();
}
