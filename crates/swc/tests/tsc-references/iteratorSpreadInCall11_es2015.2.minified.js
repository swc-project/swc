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
!function(...s) {
    return s[0];
}(...new SymbolIterator);
