foo("", function*() {
    yield* {
        *[Symbol.iterator] () {
            yield (x)=>x.length
            ;
        }
    };
}, (p)=>void 0
); // T is fixed, should be string
