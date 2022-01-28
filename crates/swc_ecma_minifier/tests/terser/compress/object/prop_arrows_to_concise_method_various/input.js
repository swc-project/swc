({
    null: (x, y) => {
        x(y);
    },
    123: (x, y) => {
        x(y);
    },
    "A B": (x, y) => {
        x(y);
    },
    p1: (x, y) => {
        x(y);
    },
    p3: async (x, y) => {
        await x(y);
    },
    [c1]: (x, y) => {
        x(y);
    },
    [c3]: async (x, y) => {
        await x(y);
    },
});
