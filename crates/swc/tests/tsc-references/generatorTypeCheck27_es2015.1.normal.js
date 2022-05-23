//@target: ES6
function* g() {
    yield* function*() {
        yield (x)=>x.length;
    }();
}
