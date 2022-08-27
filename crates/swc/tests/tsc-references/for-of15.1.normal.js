//// [for-of15.ts]
class StringIterator {
    next() {
        return "";
    }
    [Symbol.iterator]() {
        return this;
    }
}
var v;
for (v of new StringIterator){} // Should fail
