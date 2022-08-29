//// [iteratorSpreadInArray7.ts]
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
var array;
array.concat([
    ...new SymbolIterator
]);
