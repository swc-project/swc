//// [generatorTypeCheck33.ts]
function* g() {
    yield 0;
    function* g2() {
        yield "";
    }
}
