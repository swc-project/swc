({
    null(x, y) {
        x(y);
    },
    123(x, y) {
        x(y);
    },
    "A B"(x, y) {
        x(y);
    },
    p1(x, y) {
        x(y);
    },
    *p2(x, y) {
        yield x(y);
    },
    async p3(x, y) {
        await x(y);
    },
    [c1](x, y) {
        x(y);
    },
    *[c2](x, y) {
        yield x(y);
    },
    async [c3](x, y) {
        await x(y);
    },
});
