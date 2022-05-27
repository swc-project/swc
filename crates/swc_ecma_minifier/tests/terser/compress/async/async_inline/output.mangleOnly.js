(async function() {
    return await 3;
})();
(async function(a) {
    await console.log(a);
})(4);
function a(a, b) {
    return a(b);
}
a(async function() {
    return await 1;
});
a(async function(a) {
    await console.log(a);
}, 2);
function b() {
    console.log("top");
}
b();
async function c() {
    console.log("async_top");
}
c();
