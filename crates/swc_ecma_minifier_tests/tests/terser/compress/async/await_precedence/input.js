async function f1() {
    (await x) + y;
}
async function f2() {
    await (x + y);
}
