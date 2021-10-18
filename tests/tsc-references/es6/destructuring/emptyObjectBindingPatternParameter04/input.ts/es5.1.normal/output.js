function _throw(e) {
    throw e;
}
// @declaration: true
function f(param) {
    var ref = param === void 0 ? {
        a: 1,
        b: "2",
        c: true
    } : param, ref = ref !== null ? ref : _throw(new TypeError("Cannot destructure undefined"));
    var x, y, z;
}
