//// [for-of14.ts]
var v;
for (v of new class {
    next() {
        return "";
    }
});
