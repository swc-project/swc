//// [generatorTypeCheck58.ts]
function* g() {
    class C {
    }
    C.x = yield 0;
}
