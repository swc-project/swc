async function f1() {
    return (await foo()).bar;
}
async function f2() {
    return await foo().bar;
}
