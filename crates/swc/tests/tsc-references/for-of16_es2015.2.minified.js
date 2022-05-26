var v;
class StringIterator {
    [Symbol.iterator]() {
        return this;
    }
}
for (v of new StringIterator);
