//@target: ES6
class StringIterator {
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
var v;
for (v of new StringIterator){} // Should succeed
