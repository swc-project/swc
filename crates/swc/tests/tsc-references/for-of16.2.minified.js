//// [for-of16.ts]
var v;
class StringIterator {
    [Symbol.iterator]() {
        return this;
    }
}
for (v of new StringIterator);
for (v of new StringIterator);
