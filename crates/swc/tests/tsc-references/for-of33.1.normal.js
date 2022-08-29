//// [for-of33.ts]
class StringIterator {
    [Symbol.iterator]() {
        return v;
    }
}
for (var v of new StringIterator){}
