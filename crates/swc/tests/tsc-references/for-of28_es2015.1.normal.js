var tmp = Symbol.iterator;
//@target: ES6
class StringIterator {
    [tmp]() {
        return this;
    }
}
for (var v of new StringIterator){
}
