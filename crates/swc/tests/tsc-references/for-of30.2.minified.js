//// [for-of30.ts]
let _Symbol_iterator = Symbol.iterator;
for (var v of new class {
    next() {
        return {
            done: !1,
            value: ""
        };
    }
    [_Symbol_iterator]() {
        return this;
    }
    constructor(){
        this.return = 0;
    }
});
