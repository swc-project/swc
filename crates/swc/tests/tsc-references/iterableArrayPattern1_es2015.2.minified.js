let _iterator = Symbol.iterator;
var [a, b] = new class {
    next() {
        return {
            value: Symbol(),
            done: !1
        };
    }
    [_iterator]() {
        return this;
    }
};
