var x;
class StringIterator {
    next() {
        return x;
    }
    [Symbol.iterator]() {
        return this;
    }
}
for (var v of new StringIterator);
