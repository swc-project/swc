function f(a, b) {
    if (a) {
        if (b) return b;
        return;
    }
    g();
}
