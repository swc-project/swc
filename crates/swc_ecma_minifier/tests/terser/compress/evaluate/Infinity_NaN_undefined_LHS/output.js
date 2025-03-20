function f() {
    Infinity = 1 / 0;
    ++Infinity;
    Infinity--;
    NaN *= NaN;
    ++NaN;
    NaN--;
    undefined |= void 0;
    ++undefined;
    undefined--;
}
