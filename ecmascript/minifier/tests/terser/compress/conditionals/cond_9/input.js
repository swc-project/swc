function f(x, y) {
    g() ? x(1) : x(2);
    x ? (y || x)() : (y || x)();
    x ? y(a, b) : y(d, b, c);
    x ? y(a, b, c) : y(a, b, c);
    x ? y(a, b, c) : y(a, b, f);
    x ? y(a, b, c) : y(a, e, c);
    x ? y(a, b, c) : y(a, e, f);
    x ? y(a, b, c) : y(d, b, c);
    x ? y(a, b, c) : y(d, b, f);
    x ? y(a, b, c) : y(d, e, c);
    x ? y(a, b, c) : y(d, e, f);
}
