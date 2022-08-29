//// [iteratorSpreadInCall11.ts]
function foo(...s) {
    return s[0];
}
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
foo(...new SymbolIterator);
