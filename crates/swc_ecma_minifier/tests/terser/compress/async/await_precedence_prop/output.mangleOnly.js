async function a() {
    return (await foo()).bar;
}
async function b() {
    return await foo().bar;
}
