class SymbolIterator {
    next() {
        return {
            value: Symbol(),
            done: !1
        };
    }
    [Symbol.iterator]() {
        return this;
    }
}
[
    0,
    1
].concat([
    ...new SymbolIterator
]);
