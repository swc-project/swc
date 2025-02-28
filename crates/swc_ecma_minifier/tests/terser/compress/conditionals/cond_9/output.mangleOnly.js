function n(i, f) {
    g() ? i(1) : i(2);
    i ? (f || i)() : (f || i)();
    i ? f(a, b) : f(d, b, c);
    i ? f(a, b, c) : f(a, b, c);
    i ? f(a, b, c) : f(a, b, n);
    i ? f(a, b, c) : f(a, e, c);
    i ? f(a, b, c) : f(a, e, n);
    i ? f(a, b, c) : f(d, b, c);
    i ? f(a, b, c) : f(d, b, n);
    i ? f(a, b, c) : f(d, e, c);
    i ? f(a, b, c) : f(d, e, n);
}
