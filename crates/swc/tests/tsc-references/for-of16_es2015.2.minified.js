var v;
let _iterator = Symbol.iterator;
for (v of new class {
    [_iterator]() {
        return this;
    }
});
 // Should fail
