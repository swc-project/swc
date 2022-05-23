//@target: ES6
function* g2() {
    yield function*() {
        yield (x)=>x.length;
    }();
}
