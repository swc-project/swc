var v;
let _iterator = Symbol.iterator;
for (v of new class {
    next() {
        return "";
    }
    [_iterator]() {
        return this;
    }
});
