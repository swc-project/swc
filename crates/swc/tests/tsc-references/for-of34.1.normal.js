//// [for-of34.ts]
class StringIterator {
    next() {
        return v;
    }
    [Symbol.iterator]() {
        return this;
    }
}
for (var v of new StringIterator){}
