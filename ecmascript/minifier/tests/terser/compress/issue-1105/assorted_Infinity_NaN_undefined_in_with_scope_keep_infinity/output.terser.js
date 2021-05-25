var f = console.log,
    o = { undefined: 3, NaN: 4, Infinity: 5 };
if (o) {
    f(void 0, void 0);
    f(NaN, NaN);
    f(Infinity, 1 / 0);
    f(-Infinity, -1 / 0);
    f(NaN, NaN);
}
with (o) {
    f(undefined, void 0);
    f(NaN, 0 / 0);
    f(Infinity, 1 / 0);
    f(-Infinity, -1 / 0);
    f(9 + undefined, 9 + void 0);
}
