//// [iteratorSpreadInArray6.ts]
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
var array = [
    0,
    1
];
array.concat([
    ...new SymbolIterator
]);
