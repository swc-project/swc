({
    null: function(n, i) {
        n(i);
    },
    123: function(n, i) {
        n(i);
    },
    "A B": function(n, i) {
        n(i);
    },
    p1: function(n, i) {
        n(i);
    },
    p2: function*(n, i) {
        yield n(i);
    },
    p3: async function(n, i) {
        await n(i);
    },
    [c1]: function(n, i) {
        n(i);
    },
    [c2]: function*(n, i) {
        yield n(i);
    },
    [c3]: async function(n, i) {
        await n(i);
    }
});
