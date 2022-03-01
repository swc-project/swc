let _iterator = Symbol.iterator;
!function(...s) {
    return s[0];
}(...new class {
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
