var x, tmp = Symbol.iterator;
for (var v of new class {
    next() {
        return x;
    }
    [tmp]() {
        return this;
    }
});
