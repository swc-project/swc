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
var array = [
    ...[
        0,
        1
    ],
    ...new SymbolIterator
];
