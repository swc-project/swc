//// [generatorTypeCheck28.ts]
function* g() {
    yield* {
        *[Symbol.iterator] () {
            yield (x)=>x.length;
        }
    };
}
