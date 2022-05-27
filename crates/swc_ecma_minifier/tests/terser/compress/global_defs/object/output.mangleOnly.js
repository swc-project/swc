function a(a) {
    return a.VALUE;
}
function b() {
    var a = {
        VALUE: 1
    };
    return a.VALUE;
}
function c() {
    return CONFIG.VALUE;
}
if (CONFIG.DEBUG[0]) console.debug("foo");
