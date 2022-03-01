let _iterator = Symbol.iterator;
!function(s1, ...s) {}(...new class {
    next() {
        return {
            value: Symbol(),
            done: !1
        };
    }
    [_iterator]() {
        return this;
    }
});
