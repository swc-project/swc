//// [iteratorSpreadInCall5.ts]
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
class _StringIterator {
    next() {
        return {
            value: "",
            done: !1
        };
    }
    [Symbol.iterator]() {
        return this;
    }
}
new SymbolIterator, new _StringIterator;
