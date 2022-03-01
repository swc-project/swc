let _iterator = Symbol.iterator;
//@target: ES6
class StringIterator {
    next() {
        return "";
    }
    [_iterator]() {
        return this;
    }
}
var v;
for (v of new StringIterator){} // Should fail
