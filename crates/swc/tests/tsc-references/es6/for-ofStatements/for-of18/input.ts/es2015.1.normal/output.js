var tmp = Symbol.iterator;
//@target: ES6
class StringIterator {
    next() {
        return {
            value: "",
            done: false
        };
    }
    [tmp]() {
        return this;
    }
}
var v;
for (v of new StringIterator){
} // Should succeed
