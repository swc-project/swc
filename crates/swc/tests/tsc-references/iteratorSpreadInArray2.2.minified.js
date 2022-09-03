//// [iteratorSpreadInArray2.ts]
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
class NumberIterator {
    next() {
        return {
            value: 0,
            done: !1
        };
    }
    [Symbol.iterator]() {
        return this;
    }
}
var array = [
    ...new NumberIterator,
    ...new SymbolIterator
];
