let _iterator = Symbol.iterator;
new class {
    next() {
        return {
            value: Symbol()
        };
    }
    [_iterator]() {
        return this;
    }
};
