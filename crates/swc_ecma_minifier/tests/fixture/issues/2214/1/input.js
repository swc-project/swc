function f(a, b) {
    if (a) {
        if (b) return;
        foo();
    }
    bar();
}
