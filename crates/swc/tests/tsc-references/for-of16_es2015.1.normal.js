var tmp = Symbol.iterator;
//@target: ES6
class StringIterator {
    [tmp]() {
        return this;
    }
}
var v;
for (v of new StringIterator){
} // Should fail
