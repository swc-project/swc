//// [generatorYieldContextualType.ts]
f1(function*() {
    return yield 0, 0;
}), f2(async function*() {
    return yield 0, 0;
});
