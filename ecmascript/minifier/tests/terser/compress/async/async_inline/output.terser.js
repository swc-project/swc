!(async function () {
    await 3;
})();
!(async function (x) {
    await console.log(4);
})();
function invoke(x, y) {
    return x(y);
}
invoke(async function () {
    return await 1;
});
invoke(async function (x) {
    await console.log(x);
}, 2);
console.log("top");
!(async function () {
    console.log("async_top");
})();
