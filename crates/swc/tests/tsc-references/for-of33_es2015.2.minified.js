let _iterator = Symbol.iterator;
for (var v of new class {
    [_iterator]() {
        return v;
    }
});
