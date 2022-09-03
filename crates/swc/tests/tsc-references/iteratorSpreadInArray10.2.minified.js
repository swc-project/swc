//// [iteratorSpreadInArray10.ts]
class SymbolIterator {
    [Symbol.iterator]() {
        return this;
    }
}
var array = [
    ...new SymbolIterator
];
