//// [iteratorSpreadInArray7.ts]
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
(void 0).concat([
    ...new SymbolIterator
]);
