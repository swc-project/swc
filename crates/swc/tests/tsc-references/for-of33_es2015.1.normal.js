var tmp = Symbol.iterator;
//@target: ES6
//@noImplicitAny: true
class StringIterator {
    [tmp]() {
        return v;
    }
}
for (var v of new StringIterator){
}
