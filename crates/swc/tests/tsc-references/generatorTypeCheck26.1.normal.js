//// [generatorTypeCheck26.ts]
function* g() {
    yield (x)=>x.length;
    yield* [
        (x)=>x.length
    ];
    return (x)=>x.length;
}
