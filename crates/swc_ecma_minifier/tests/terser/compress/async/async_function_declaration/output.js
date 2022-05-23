async function f0() {}
async function f1() {
    await x, y;
}
async function f2() {
    await (x + y);
}
async function f3() {
    await x, await y;
}
async function f4() {
    await (x + (await y));
}
async function f5() {
    await x;
    await y;
}
async function f6() {
    await x, await y;
}
