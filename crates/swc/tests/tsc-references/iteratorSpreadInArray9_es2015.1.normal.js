let _iterator = Symbol.iterator;
//@target: ES6
class SymbolIterator {
    next() {
        return {
            value: Symbol()
        };
    }
    [_iterator]() {
        return this;
    }
}
var array = [
    ...new SymbolIterator
];
