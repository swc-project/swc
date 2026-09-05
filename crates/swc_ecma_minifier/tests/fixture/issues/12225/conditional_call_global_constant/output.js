function f(a, b) {
    return b;
}
let x = true;
f(void 0, x ? 1 : 2);
f(1 / 0, x ? 1 : 2);
