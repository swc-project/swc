let _iterator = Symbol.iterator, _iterator1 = Symbol.iterator;
new class {
    next() {
        return {
            value: 0,
            done: !1
        };
    }
    [_iterator1]() {
        return this;
    }
}, new class {
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
