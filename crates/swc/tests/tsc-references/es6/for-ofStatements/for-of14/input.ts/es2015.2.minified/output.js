var v;
for (v of new class {
    next() {
        return "";
    }
});
 // Should fail because the iterator is not iterable
