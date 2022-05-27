//@target: ES6
class StringIterator {
    [Symbol.iterator]() {
        return x;
    }
}
var x;
for (var v of new StringIterator){}
