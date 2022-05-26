var x;
class StringIterator {
    [Symbol.iterator]() {
        return x;
    }
}
for (var v of new StringIterator);
