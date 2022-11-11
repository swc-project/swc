//// [for-of30.ts]
let _Symbol_iterator = Symbol.iterator;
class StringIterator {
    next() {
        return {
            done: false,
            value: ""
        };
    }
    [_Symbol_iterator]() {
        return this;
    }
    constructor(){
        this.return = 0;
    }
}
for (var v of new StringIterator){}
