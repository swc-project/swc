var v, tmp = Symbol.iterator;
for (v of new class {
    [tmp]() {
        return this;
    }
});
 // Should fail
