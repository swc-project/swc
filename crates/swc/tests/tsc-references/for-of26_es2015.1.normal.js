//@target: ES6
class StringIterator {
    next() {
        return x;
    }
    [Symbol.iterator]() {
        return this;
    }
}
var x;
for (var v of new StringIterator){}
