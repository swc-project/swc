//// [generatorReturnTypeFallback.1.ts]
// Allow generators to fallback to IterableIterator if they do not need a type for the sent value while in strictNullChecks mode.
function* f() {
    yield 1;
}
