//// [iteratorSpreadInArray10.ts]
class SymbolIterator {
    [Symbol.iterator]() {
        return this;
    }
}
new SymbolIterator;
