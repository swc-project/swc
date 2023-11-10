//// [generatorTypeCheck46.ts]
foo("", function*() {
    yield* {
        *[Symbol.iterator] () {
            yield (x)=>x.length;
        }
    };
}, (p)=>void 0);
