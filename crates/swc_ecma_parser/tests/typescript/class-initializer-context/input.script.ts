function* generatorDefaults(value = class {
    accessor field = function* () { yield 1; };
    private other = function* () { yield 2; };
    static { function* nested() { yield 3; } }
}) {
    yield 4;
}
async function asyncDefaults(value = class {
    accessor field = await + 1;
    private other = async () => await 2;
    static field = await + 3;
    static { async function nested() { await 4; } }
}) {
    await 5;
}
