function f(h, i) {
    g() ? h(1) : h(2);
    h ? (i || h)() : (i || h)();
    h ? i(a, b) : i(d, b, c);
    h ? i(a, b, c) : i(a, b, c);
    h ? i(a, b, c) : i(a, b, f);
    h ? i(a, b, c) : i(a, e, c);
    h ? i(a, b, c) : i(a, e, f);
    h ? i(a, b, c) : i(d, b, c);
    h ? i(a, b, c) : i(d, b, f);
    h ? i(a, b, c) : i(d, e, c);
    h ? i(a, b, c) : i(d, e, f);
}
