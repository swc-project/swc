let _iterator = Symbol.iterator, _iterator1 = Symbol.iterator;
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
}, ...new class {
    next() {
        return {
            value: "",
            done: !1
        };
    }
    [_iterator1]() {
        return this;
    }
});
