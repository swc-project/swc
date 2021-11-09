var tmp = Symbol.iterator;
for (var v of new class {
    next() {
        return {
            done: !1,
            value: ""
        };
    }
    [tmp]() {
        return this;
    }
    constructor(){
        this.return = 0;
    }
});
