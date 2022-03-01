let _iterator = Symbol.iterator;
//@target: ES6
class SymbolIterator {
    [_iterator]() {
        return this;
    }
}
var array = [
    ...new SymbolIterator
];
