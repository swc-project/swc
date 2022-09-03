//// [generatorTypeCheck26.ts]
function* g() {
    return yield (x)=>x.length, yield* [
        (x)=>x.length
    ], (x)=>x.length;
}
