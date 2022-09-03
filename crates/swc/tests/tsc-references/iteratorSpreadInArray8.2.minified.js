//// [iteratorSpreadInArray8.ts]
class SymbolIterator {
    next() {
        return {
            value: Symbol(),
            done: !1
        };
    }
}
var array = [
    ...new SymbolIterator
];
