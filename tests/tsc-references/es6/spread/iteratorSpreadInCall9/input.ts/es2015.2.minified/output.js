var tmp = Symbol.iterator, tmp1 = Symbol.iterator;
new class {
    constructor(...s){
    }
}(...new class {
    next() {
        return {
            value: Symbol(),
            done: !1
        };
    }
    [tmp]() {
        return this;
    }
}, ...[
    ...new class {
        next() {
            return {
                value: "",
                done: !1
            };
        }
        [tmp1]() {
            return this;
        }
    }
]);
