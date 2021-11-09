var tmp = Symbol.iterator;
//@target: ES6
class SymbolIterator {
    next() {
        return {
            value: Symbol()
        };
    }
    [tmp]() {
        return this;
    }
}
var array = [
    ...new SymbolIterator
];
