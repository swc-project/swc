//// [iterableArrayPattern2.ts]
class SymbolIterator {
    next() {
        return {
            value: Symbol(),
            done: false
        };
    }
    [Symbol.iterator]() {
        return this;
    }
}
var [a, ...b] = new SymbolIterator;
