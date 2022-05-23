(async function () {
    return await 3;
})();
(async function (x) {
    await console.log(x);
})(4);
function invoke(x, y) {
    return x(y);
}
invoke(async function () {
    return await 1;
});
invoke(async function (x) {
    await console.log(x);
}, 2);
function top() {
    console.log("top");
}
top();
async function async_top() {
    console.log("async_top");
}
async_top();
