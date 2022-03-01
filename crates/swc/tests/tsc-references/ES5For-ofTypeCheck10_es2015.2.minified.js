let _iterator = Symbol.iterator;
for (var v of new class {
    next() {
        return {
            done: !0,
            value: ""
        };
    }
    [_iterator]() {
        return this;
    }
});
