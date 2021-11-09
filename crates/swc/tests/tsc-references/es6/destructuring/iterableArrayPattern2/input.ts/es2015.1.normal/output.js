var tmp = Symbol.iterator;
//@target: ES6
class SymbolIterator {
    next() {
        return {
            value: Symbol(),
            done: false
        };
    }
    [tmp]() {
        return this;
    }
}
var [a, ...b] = new SymbolIterator;
