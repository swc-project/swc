//// [for-of17.ts]
var v;
class NumberIterator {
    next() {
        return {
            value: 0,
            done: !1
        };
    }
    [Symbol.iterator]() {
        return this;
    }
}
for (v of new NumberIterator);
 // Should succeed
