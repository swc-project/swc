//// [for-of16.ts]
class StringIterator {
    [Symbol.iterator]() {
        return this;
    }
}
var v;
for (v of new StringIterator){} // Should fail
for (v of new StringIterator){} // Should still fail (related errors should still be shown even though type is cached).
