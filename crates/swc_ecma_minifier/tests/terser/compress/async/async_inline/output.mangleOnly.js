(async function() {
    return await 3;
})();
(async function(n) {
    await console.log(n);
})(4);
function n(n, t) {
    return n(t);
}
n(async function() {
    return await 1;
});
n(async function(n) {
    await console.log(n);
}, 2);
function t() {
    console.log("top");
}
t();
async function a() {
    console.log("async_top");
}
a();
