var tmp = Symbol.iterator, tmp1 = Symbol.iterator;
new class {
    next() {
        return {
            value: 0,
            done: !1
        };
    }
    [tmp1]() {
        return this;
    }
}, new class {
    next() {
        return {
            value: Symbol(),
            done: !1
        };
    }
    [tmp]() {
        return this;
    }
};
