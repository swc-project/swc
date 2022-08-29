//// [generatorTypeCheck42.ts]
function* g() {
    let x = {
        [yield 0] () {}
    };
}
