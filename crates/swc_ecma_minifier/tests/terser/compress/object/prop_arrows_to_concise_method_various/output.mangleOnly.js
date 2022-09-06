({
    null: (a, c) => {
        a(c);
    },
    123: (a, c) => {
        a(c);
    },
    "A B": (a, c) => {
        a(c);
    },
    p1: (a, c) => {
        a(c);
    },
    p3: async (a, c) => {
        await a(c);
    },
    [c1]: (a, c) => {
        a(c);
    },
    [c3]: async (a, c) => {
        await a(c);
    },
});
