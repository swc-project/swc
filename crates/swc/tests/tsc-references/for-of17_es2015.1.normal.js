let _iterator = Symbol.iterator;
//@target: ES6
class NumberIterator {
    next() {
        return {
            value: 0,
            done: false
        };
    }
    [_iterator]() {
        return this;
    }
}
var v;
for (v of new NumberIterator){} // Should succeed
