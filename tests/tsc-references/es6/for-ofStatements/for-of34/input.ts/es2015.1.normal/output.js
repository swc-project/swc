var tmp = Symbol.iterator;
//@target: ES6
//@noImplicitAny: true
class StringIterator {
    next() {
        return v;
    }
    [tmp]() {
        return this;
    }
}
for (var v of new StringIterator){
}
