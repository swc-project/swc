//@target: ES6
class Foo {
    constructor(...s){
    }
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
var tmp1 = Symbol.iterator;
class _StringIterator {
    next() {
        return {
            value: "",
            done: false
        };
    }
    [tmp1]() {
        return this;
    }
}
new Foo(...new SymbolIterator, ...[
    ...new _StringIterator
]);
