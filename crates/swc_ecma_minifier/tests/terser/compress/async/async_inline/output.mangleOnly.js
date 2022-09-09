(async function () {
    return await 3;
})();
(async function (n) {
    await console.log(n);
})(4);
function n(n, o) {
    return n(o);
}
n(async function () {
    return await 1;
});
n(async function (n) {
    await console.log(n);
}, 2);
function o() {
    console.log("top");
}
o();
async function c() {
    console.log("async_top");
}
c();
