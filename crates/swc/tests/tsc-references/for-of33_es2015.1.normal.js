let _iterator = Symbol.iterator;
//@target: ES6
//@noImplicitAny: true
class StringIterator {
    [_iterator]() {
        return v;
    }
}
for (var v of new StringIterator){}
