//// [iteratorSpreadInArray7.ts]
var array;
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
array.concat([
    ...new SymbolIterator
]);
