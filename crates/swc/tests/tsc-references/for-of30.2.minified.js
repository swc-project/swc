//// [for-of30.ts]
let _iterator = Symbol.iterator;
class StringIterator {
    next() {
        return {
            done: !1,
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
for (var v of new StringIterator);
