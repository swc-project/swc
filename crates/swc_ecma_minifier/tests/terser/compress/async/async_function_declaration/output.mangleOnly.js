async function a() {}
async function b() {
    (await x) + y;
}
async function c() {
    await (x + y);
}
async function d() {
    (await x) + (await y);
}
async function e() {
    await (x + (await y));
}
async function f() {
    await x;
    await y;
}
async function g() {
    await x, await y;
}
