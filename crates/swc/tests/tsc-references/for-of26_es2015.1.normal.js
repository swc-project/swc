let _iterator = Symbol.iterator;
//@target: ES6
class StringIterator {
    next() {
        return x;
    }
    [_iterator]() {
        return this;
    }
}
var x;
for (var v of new StringIterator){}
