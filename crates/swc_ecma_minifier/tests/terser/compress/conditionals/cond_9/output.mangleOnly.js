function n(f, i) {
    g() ? f(1) : f(2);
    f ? (i || f)() : (i || f)();
    f ? i(a, b) : i(d, b, c);
    f ? i(a, b, c) : i(a, b, c);
    f ? i(a, b, c) : i(a, b, n);
    f ? i(a, b, c) : i(a, e, c);
    f ? i(a, b, c) : i(a, e, n);
    f ? i(a, b, c) : i(d, b, c);
    f ? i(a, b, c) : i(d, b, n);
    f ? i(a, b, c) : i(d, e, c);
    f ? i(a, b, c) : i(d, e, n);
}
