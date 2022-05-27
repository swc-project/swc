async function a() {
    (await x) + y;
}
async function b() {
    await (x + y);
}
