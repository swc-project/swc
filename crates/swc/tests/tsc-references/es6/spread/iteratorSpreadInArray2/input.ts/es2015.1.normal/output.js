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
var tmp1 = Symbol.iterator;
class NumberIterator {
    next() {
        return {
            value: 0,
            done: false
        };
    }
    [tmp1]() {
        return this;
    }
}
var array = [
    ...new NumberIterator,
    ...new SymbolIterator
];
