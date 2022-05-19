foo("", function*() {
    yield* {
        *[Symbol.iterator] () {
            yield (x)=>x.length;
        }
    };
}, (p)=>undefined); // T is fixed, should be string
