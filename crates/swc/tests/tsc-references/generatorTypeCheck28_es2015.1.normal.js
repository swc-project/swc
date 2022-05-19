//@target: ES6
function* g() {
    yield* {
        *[Symbol.iterator] () {
            yield (x)=>x.length;
        }
    };
}
