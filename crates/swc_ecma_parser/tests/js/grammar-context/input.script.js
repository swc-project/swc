function ordinary(value = class {
    field = function () { return "field" in source; };
    static { function nested() { return "nested" in source; } }
}) {
    if (value) return value;
}

function* generator(value = class {
    field = function* () { yield "field" in source; };
}) {
    for (let value = (yield source); value; value = false) {
        const values = [yield 1, ...(yield source)];
        const object = { [yield 2]: yield 3 };
        const template = `${yield 4}`;
        class C { [yield 5] = 0; }
    }
    return yield 6;
}

async function asyncFunction(value = class {
    field = async () => await 1;
}) {
    const values = [await 2, ...(await source)];
    const object = { [await 3]: await 4 };
    const template = `${await 5}`;
    class C { [await 6] = 0; }
    return await 7;
}

async function* asyncGenerator(value = class {
    field = async function* () { yield await 1; };
}) {
    const object = { [yield await 2]: yield await 3 };
    yield await 4;
    return await 5;
}

for (let value = ((value = "field" in source) => value); false;) {}
for (let value = ["field" in source, ...source]; false;) {}
for (let value = { ["field" in source]: 1 }; false;) {}
