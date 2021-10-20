var x, tmp = Symbol.iterator;
for (var v of new class {
    [tmp]() {
        return x;
    }
});
