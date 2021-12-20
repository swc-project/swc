var tmp = Symbol.iterator;
//@target: ES6
class StringIterator {
    next() {
        return "";
    }
    [tmp]() {
        return this;
    }
}
var v;
for (v of new StringIterator){
} // Should fail
