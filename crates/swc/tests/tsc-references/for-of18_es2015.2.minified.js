var v;
let _iterator = Symbol.iterator;
for (v of new class {
    next() {
        return {
            value: "",
            done: !1
        };
    }
    [_iterator]() {
        return this;
    }
});
 // Should succeed
