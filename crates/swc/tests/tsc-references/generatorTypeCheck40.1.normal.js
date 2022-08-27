//// [generatorTypeCheck40.ts]
function* g() {
    class C extends (yield 0) {
    }
}
