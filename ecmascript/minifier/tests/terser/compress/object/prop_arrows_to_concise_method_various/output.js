({
    null (x, y) {
        x(y);
    },
    123 (x1, y1) {
        x1(y1);
    },
    "A B" (x2, y2) {
        x2(y2);
    },
    p1 (x3, y3) {
        x3(y3);
    },
    async p3 (x4, y4) {
        await x4(y4);
    },
    [c1] (x5, y5) {
        x5(y5);
    },
    async [c3] (x6, y6) {
        await x6(y6);
    }
});
