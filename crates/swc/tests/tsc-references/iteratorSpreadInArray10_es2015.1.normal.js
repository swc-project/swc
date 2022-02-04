var tmp = Symbol.iterator;
//@target: ES6
class SymbolIterator {
    [tmp]() {
        return this;
    }
}
var array = [
    ...new SymbolIterator
];
