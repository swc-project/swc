//// [generatorExplicitReturnType.ts]
function* g1() {
    return yield, yield "a", yield 1, 10;
}
function* g2() {
    return yield 1, !0;
}
function* g3() {
    return yield* generator, !0;
}
function* g4() {
    return yield* generator, !0;
}
