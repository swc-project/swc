//@target: ES6
function foo(...s) {
    return s[0];
}
let _iterator = Symbol.iterator;
class SymbolIterator {
    next() {
        return {
            value: Symbol(),
            done: false
        };
    }
    [_iterator]() {
        return this;
    }
}
foo(...new SymbolIterator);
