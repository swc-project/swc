//// [generatorTypeCheck56.ts]
function* g() {
    var x = class C {
        *[yield 0]() {
            yield 0;
        }
    };
}
