var tmp = Symbol.iterator;
//@target: ES6
class StringIterator {
    next() {
        return x;
    }
    [tmp]() {
        return this;
    }
}
var x;
for (var v of new StringIterator){
}
