let _iterator = Symbol.iterator;
//@target: ES6
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
let _iterator1 = Symbol.iterator;
class NumberIterator {
    next() {
        return {
            value: 0,
            done: false
        };
    }
    [_iterator1]() {
        return this;
    }
}
var array = [
    ...new NumberIterator,
    ...new SymbolIterator
];
