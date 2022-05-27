class SymbolIterator {
    [Symbol.iterator]() {
        return this;
    }
}
new SymbolIterator;
