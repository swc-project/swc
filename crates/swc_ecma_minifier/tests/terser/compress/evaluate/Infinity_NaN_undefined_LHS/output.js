function f() {
    1 / 0;
    ++Infinity;
    Infinity--;
    NaN *= 0 / 0;
    ++NaN;
    NaN--;
    undefined |= void 0;
    ++undefined;
    undefined--;
}
