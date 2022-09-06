({
    null: function (n, c) {
        n(c);
    },
    123: function (n, c) {
        n(c);
    },
    "A B": function (n, c) {
        n(c);
    },
    p1: function (n, c) {
        n(c);
    },
    p2: function* (n, c) {
        yield n(c);
    },
    p3: async function (n, c) {
        await n(c);
    },
    [c1]: function (n, c) {
        n(c);
    },
    [c2]: function* (n, c) {
        yield n(c);
    },
    [c3]: async function (n, c) {
        await n(c);
    },
});
