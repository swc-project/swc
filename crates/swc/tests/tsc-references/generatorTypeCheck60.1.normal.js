//// [generatorTypeCheck60.ts]
function* g() {
    class C extends (yield) {
    }
    ;
}
