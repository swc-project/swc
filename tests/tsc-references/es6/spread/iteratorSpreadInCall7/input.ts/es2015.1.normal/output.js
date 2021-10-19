//@target: ES6
function foo(...s) {
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
foo(...new SymbolIterator, ...new _StringIterator);
