//// [for-of30.ts]
class StringIterator {
    next() {
        return {
            done: !1,
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
for (var v of new StringIterator);
