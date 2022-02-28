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
var array = [
    ...[
        0,
        1
    ],
    ...new SymbolIterator
];
