let _iterator = Symbol.iterator;
//@target: ES6
class StringIterator {
    next() {
        return {
            done: false,
            value: ""
        };
    }
    [_iterator]() {
        return this;
    }
    constructor(){
        this.return = 0;
    }
}
for (var v of new StringIterator){}
