var tmp = Symbol.iterator;
//@target: ES6
class StringIterator {
    next() {
        return {
            // no done property
            value: ""
        };
    }
    [tmp]() {
        return this;
    }
}
for (var v of new StringIterator){
}
