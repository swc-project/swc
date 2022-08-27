//// [for-of31.ts]
class StringIterator {
    next() {
        return {
            value: ""
        };
    }
    [Symbol.iterator]() {
        return this;
    }
}
for (var v of new StringIterator);
