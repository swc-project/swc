async function a() {
    return (await foo()).bar;
}
async function n() {
    return await foo().bar;
}
