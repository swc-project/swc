({
    null: function(a, b) {
        a(b);
    },
    123: function(a, b) {
        a(b);
    },
    "A B": function(a, b) {
        a(b);
    },
    p1: function(a, b) {
        a(b);
    },
    p2: function*(a, b) {
        yield a(b);
    },
    p3: async function(a, b) {
        await a(b);
    },
    [c1]: function(a, b) {
        a(b);
    },
    [c2]: function*(a, b) {
        yield a(b);
    },
    [c3]: async function(a, b) {
        await a(b);
    }
});
