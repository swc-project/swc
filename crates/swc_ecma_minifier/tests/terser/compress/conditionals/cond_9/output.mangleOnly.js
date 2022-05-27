function f(i, h) {
    g() ? i(1) : i(2);
    i ? (h || i)() : (h || i)();
    i ? h(a, b) : h(d, b, c);
    i ? h(a, b, c) : h(a, b, c);
    i ? h(a, b, c) : h(a, b, f);
    i ? h(a, b, c) : h(a, e, c);
    i ? h(a, b, c) : h(a, e, f);
    i ? h(a, b, c) : h(d, b, c);
    i ? h(a, b, c) : h(d, b, f);
    i ? h(a, b, c) : h(d, e, c);
    i ? h(a, b, c) : h(d, e, f);
}
