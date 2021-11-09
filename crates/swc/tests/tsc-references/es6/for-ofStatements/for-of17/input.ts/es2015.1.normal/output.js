var tmp = Symbol.iterator;
//@target: ES6
class NumberIterator {
    next() {
        return {
            value: 0,
            done: false
        };
    }
    [tmp]() {
        return this;
    }
}
var v;
for (v of new NumberIterator){
} // Should succeed
