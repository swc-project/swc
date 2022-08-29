//// [for-of30.ts]
let _iterator = Symbol.iterator;
for (var v of new class {
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
});
