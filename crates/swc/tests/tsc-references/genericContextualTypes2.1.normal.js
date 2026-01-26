//// [genericContextualTypes2.ts]
createMachine({
    context: {
        count: 0
    },
    entry: assign({
        count: function count(ctx) {
            return ++ctx.count;
        }
    })
});
