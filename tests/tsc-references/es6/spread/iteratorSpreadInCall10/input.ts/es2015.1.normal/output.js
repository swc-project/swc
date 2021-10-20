//@target: ES6
function foo(s) {
    return s[0];
}
var tmp = Symbol.iterator;
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
foo(...new SymbolIterator);
