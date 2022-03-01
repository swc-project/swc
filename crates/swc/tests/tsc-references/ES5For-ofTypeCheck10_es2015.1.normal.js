let _iterator = Symbol.iterator;
//@target: ES5
// In ES3/5, you cannot for...of over an arbitrary iterable.
class StringIterator {
    next() {
        return {
            done: true,
            value: ""
        };
    }
    [_iterator]() {
        return this;
    }
}
for (var v of new StringIterator){}
