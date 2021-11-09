var tmp = Symbol.iterator;
!function(...s) {
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
