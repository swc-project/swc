let _iterator = Symbol.iterator;
//@target: ES6
class StringIterator {
    next() {
        return {
            value: "",
            done: false
        };
    }
    [_iterator]() {
        return this;
    }
}
var v;
for (v of new StringIterator){} // Should succeed
