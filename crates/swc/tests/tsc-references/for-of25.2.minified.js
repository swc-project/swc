//// [for-of25.ts]
class StringIterator {
    [Symbol.iterator]() {}
}
for (var v of new StringIterator);
