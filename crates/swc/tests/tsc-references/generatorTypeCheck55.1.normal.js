//// [generatorTypeCheck55.ts]
function* g() {
    var x = class C extends (yield) {
    };
}
