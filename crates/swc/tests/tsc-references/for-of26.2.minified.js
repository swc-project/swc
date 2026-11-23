//// [for-of26.ts]
class StringIterator {
    next() {}
    [Symbol.iterator]() {
        return this;
    }
}
for (var v of new StringIterator);
