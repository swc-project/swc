async function n() {
    return (await foo())();
}
async function a() {
    return await foo()();
}
