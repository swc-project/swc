var tmp = Symbol.iterator;
//@target: ES6
class StringIterator {
    [tmp]() {
        return x;
    }
}
var x;
for (var v of new StringIterator){
}
