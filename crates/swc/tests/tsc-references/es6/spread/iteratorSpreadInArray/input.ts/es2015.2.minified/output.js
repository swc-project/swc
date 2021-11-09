var tmp = Symbol.iterator;
new class {
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
