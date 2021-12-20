var tmp = Symbol.iterator;
//@target: ES5
// In ES3/5, you cannot for...of over an arbitrary iterable.
class StringIterator {
    next() {
        return {
            done: true,
            value: ""
        };
    }
    [tmp]() {
        return this;
    }
}
for (var v of new StringIterator){
}
