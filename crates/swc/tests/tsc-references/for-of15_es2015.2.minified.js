var v, tmp = Symbol.iterator;
for (v of new class {
    next() {
        return "";
    }
    [tmp]() {
        return this;
    }
});
 // Should fail
