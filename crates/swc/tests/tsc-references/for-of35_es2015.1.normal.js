var tmp = Symbol.iterator;
//@target: ES6
//@noImplicitAny: true
class StringIterator {
    next() {
        return {
            done: true,
            value: v
        };
    }
    [tmp]() {
        return this;
    }
}
for (var v of new StringIterator){
}
