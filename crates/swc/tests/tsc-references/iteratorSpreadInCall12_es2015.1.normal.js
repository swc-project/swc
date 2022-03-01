//@target: ES6
class Foo {
    constructor(...s){}
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
let _iterator1 = Symbol.iterator;
class _StringIterator {
    next() {
        return {
            value: "",
            done: false
        };
    }
    [_iterator1]() {
        return this;
    }
}
new Foo(...[
    ...new SymbolIterator,
    ...[
        ...new _StringIterator
    ]
]);
