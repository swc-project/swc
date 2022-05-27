//@target: ES6
class Foo {
    constructor(...s){}
}
class SymbolIterator {
    next() {
        return {
            value: Symbol(),
            done: false
        };
    }
    [Symbol.iterator]() {
        return this;
    }
}
class _StringIterator {
    next() {
        return {
            value: "",
            done: false
        };
    }
    [Symbol.iterator]() {
        return this;
    }
}
new Foo(...[
    ...new SymbolIterator,
    ...[
        ...new _StringIterator
    ]
]);
