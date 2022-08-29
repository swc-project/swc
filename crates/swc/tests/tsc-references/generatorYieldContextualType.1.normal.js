//// [generatorYieldContextualType.ts]
f1(function*() {
    const a = yield 0;
    return 0;
});
f2(async function*() {
    const a = yield 0;
    return 0;
});
