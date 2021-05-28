({
    null: function (x, y) {
        x(y);
    },
    123: function (x, y) {
        x(y);
    },
    "A B": function (x, y) {
        x(y);
    },
    p1: function (x, y) {
        x(y);
    },
    p2: function* (x, y) {
        yield x(y);
    },
    p3: async function (x, y) {
        await x(y);
    },
    [c1]: function (x, y) {
        x(y);
    },
    [c2]: function* (x, y) {
        yield x(y);
    },
    [c3]: async function (x, y) {
        await x(y);
    },
});
