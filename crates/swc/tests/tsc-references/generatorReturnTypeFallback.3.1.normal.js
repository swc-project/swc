//// [generatorReturnTypeFallback.3.ts]
// Do not allow generators to fallback to IterableIterator while in strictNullChecks mode if they need a type for the sent value.
// NOTE: In non-strictNullChecks mode, `undefined` (the default sent value) is assignable to everything.
function* f() {
    const x = yield 1;
}
