async function f3() {
    return (await foo())();
}
async function f4() {
    return await foo()();
}
