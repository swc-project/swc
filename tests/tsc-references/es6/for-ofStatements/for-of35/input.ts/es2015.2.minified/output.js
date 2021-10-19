var tmp = Symbol.iterator;
for (var v of new class {
    next() {
        return {
            done: !0,
            value: v
        };
    }
    [tmp]() {
        return this;
    }
});
