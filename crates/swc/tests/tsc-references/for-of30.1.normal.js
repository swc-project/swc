//// [for-of30.ts]
class StringIterator {
    next() {
        return {
            done: false,
            value: ""
        };
    }
    [Symbol.iterator]() {
        return this;
    }
    constructor(){
        this.return = 0;
    }
}
for (var v of new StringIterator){}
