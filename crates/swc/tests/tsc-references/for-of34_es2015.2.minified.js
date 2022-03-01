let _iterator = Symbol.iterator;
for (var v of new class {
    next() {
        return v;
    }
    [_iterator]() {
        return this;
    }
});
