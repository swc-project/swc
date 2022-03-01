let _iterator = Symbol.iterator;
//@target: ES6
class StringIterator {
    [_iterator]() {
        return x;
    }
}
var x;
for (var v of new StringIterator){}
