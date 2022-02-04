var tmp = Symbol.iterator;
!function(s) {
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
});
