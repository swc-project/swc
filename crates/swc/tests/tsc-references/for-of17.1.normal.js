//// [for-of17.ts]
class NumberIterator {
    next() {
        return {
            value: 0,
            done: false
        };
    }
    [Symbol.iterator]() {
        return this;
    }
}
var v;
for (v of new NumberIterator){} // Should succeed
