var tmp = Symbol.iterator;
for (var v of new class {
    next() {
        return v;
    }
    [tmp]() {
        return this;
    }
});
