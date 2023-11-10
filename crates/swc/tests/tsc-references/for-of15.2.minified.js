//// [for-of15.ts]
var v;
class StringIterator {
    next() {
        return "";
    }
    [Symbol.iterator]() {
        return this;
    }
}
for (v of new StringIterator);
