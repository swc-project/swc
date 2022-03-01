let _iterator = Symbol.iterator;
//@target: ES6
//@noImplicitAny: true
class StringIterator {
    next() {
        return {
            done: true,
            value: v
        };
    }
    [_iterator]() {
        return this;
    }
}
for (var v of new StringIterator){}
