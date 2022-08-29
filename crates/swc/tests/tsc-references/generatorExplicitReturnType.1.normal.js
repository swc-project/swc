//// [generatorExplicitReturnType.ts]
function* g1() {
    yield; // error
    yield "a"; // error
    const x = yield 1; // error
    return 10; // error
}
function* g2() {
    const x = yield 1;
    return true;
}
function* g3() {
    const x = yield* generator; // error
    return true;
}
function* g4() {
    const x = yield* generator;
    return true;
}
