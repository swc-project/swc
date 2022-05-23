function f(x, y) {
    g() ? x(1) : x(2);
    (y || x)();
    x ? y(a, b) : y(d, b, c);
    y(a, b, c);
    y(a, b, x ? c : f);
    y(a, x ? b : e, c);
    x ? y(a, b, c) : y(a, e, f);
    y(x ? a : d, b, c);
    x ? y(a, b, c) : y(d, b, f);
    x ? y(a, b, c) : y(d, e, c);
    x ? y(a, b, c) : y(d, e, f);
}
