async function a() {}
async function n() {
    (await x) + y;
}
async function i() {
    await (x + y);
}
async function t() {
    (await x) + (await y);
}
async function c() {
    await (x + (await y));
}
async function w() {
    await x;
    await y;
}
async function f() {
    await x, await y;
}
