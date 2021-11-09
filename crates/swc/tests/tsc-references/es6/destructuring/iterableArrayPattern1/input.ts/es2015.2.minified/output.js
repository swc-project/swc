var tmp = Symbol.iterator, [a, b] = new class {
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
