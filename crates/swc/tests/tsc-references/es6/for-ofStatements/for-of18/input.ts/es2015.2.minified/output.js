var v, tmp = Symbol.iterator;
for (v of new class {
    next() {
        return {
            value: "",
            done: !1
        };
    }
    [tmp]() {
        return this;
    }
});
 // Should succeed
