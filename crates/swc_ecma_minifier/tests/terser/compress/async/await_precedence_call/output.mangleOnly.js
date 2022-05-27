async function a() {
    return (await foo())();
}
async function b() {
    return await foo()();
}
