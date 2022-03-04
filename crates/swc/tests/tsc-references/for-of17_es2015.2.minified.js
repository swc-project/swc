var v;
let _iterator = Symbol.iterator;
for (v of new class {
    next() {
        return {
            value: 0,
            done: !1
        };
    }
    [_iterator]() {
        return this;
    }
});
