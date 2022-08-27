//// [for-of16.ts]
class StringIterator {
    [Symbol.iterator]() {
        return this;
    }
}
var v;
for (v of new StringIterator){} // Should fail
