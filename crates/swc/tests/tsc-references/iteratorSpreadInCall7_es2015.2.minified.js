var tmp = Symbol.iterator, tmp1 = Symbol.iterator;
!function(...s) {
    return s[0];
}(...new class {
    next() {
        return {
            value: Symbol(),
            done: !1
        };
    }
    [tmp]() {
        return this;
    }
}, ...new class {
    next() {
        return {
            value: "",
            done: !1
        };
    }
    [tmp1]() {
        return this;
    }
});
