var x;
let _iterator = Symbol.iterator;
for (var v of new class {
    next() {
        return x;
    }
    [_iterator]() {
        return this;
    }
});
