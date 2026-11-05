function* computedNames() {
    class C { [yield 1] = 0; static [yield 2] = 0; }
    yield 3;
}
async function computedAwait() {
    class C { [await 1] = 0; static [await 2] = 0; }
    await 3;
}
function* generatorDefaults(value = class {
    field = function* () { yield 1; };
    static field = function* () { yield 2; };
    *method() { yield 3; }
    static { function* nested() { yield 4; } }
}) {
    yield 5;
}
async function asyncDefaults(value = class {
    field = await + 1;
    static field = await + 2;
    #field = await + 3;
    deferred = async () => await 4;
    async method() { await 5; }
    static { async function nested() { await 6; } }
}) {
    await 7;
}
for (let C = class {
    field = "name" in object;
    static { const value = "name" in object; }
}; false;) {}
