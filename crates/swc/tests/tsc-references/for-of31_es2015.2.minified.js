var tmp = Symbol.iterator;
for (var v of new class {
    next() {
        return {
            value: ""
        };
    }
    [tmp]() {
        return this;
    }
});
