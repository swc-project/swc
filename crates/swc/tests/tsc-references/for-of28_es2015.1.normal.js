//@target: ES6
class StringIterator {
    [Symbol.iterator]() {
        return this;
    }
}
for (var v of new StringIterator){}
