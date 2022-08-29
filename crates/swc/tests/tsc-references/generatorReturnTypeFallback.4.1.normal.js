//// [generatorReturnTypeFallback.4.ts]
// Allow generators to fallback to IterableIterator if they are not in strictNullChecks mode
// NOTE: In non-strictNullChecks mode, `undefined` (the default sent value) is assignable to everything.
function* f() {
    const x = yield 1;
}
