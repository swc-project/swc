async function f() {
    class C {
        constructor(await, value = await(1), { [await]: key } = {}) {}
        [await 1]() {}
    }
    await 1;
}
async function* g() {
    class C {
        constructor(value = await) {}
        [yield 1]() {}
    }
}
async (C = class { constructor(value = await) {} }) => {};
