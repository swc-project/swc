let _iterator = Symbol.iterator;
for (var v of new class {
    next() {
        return {
            value: ""
        };
    }
    [_iterator]() {
        return this;
    }
});
