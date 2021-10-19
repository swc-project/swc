var tmp = Symbol.iterator;
new class {
    next() {
        return {
            value: Symbol()
        };
    }
    [tmp]() {
        return this;
    }
};
