let _iterator = Symbol.iterator;
//@target: ES6
class StringIterator {
    [_iterator]() {
        return this;
    }
}
for (var v of new StringIterator){}
