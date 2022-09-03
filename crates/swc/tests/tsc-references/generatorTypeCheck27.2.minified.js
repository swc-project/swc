//// [generatorTypeCheck27.ts]
function* g() {
    yield* function*() {
        yield (x)=>x.length;
    }();
}
