function _throw(e) {
    throw e;
}
// @declaration: true
function f(param, a) {
    var param = param !== null ? param : _throw(new TypeError("Cannot destructure undefined"));
    var x, y, z;
}
