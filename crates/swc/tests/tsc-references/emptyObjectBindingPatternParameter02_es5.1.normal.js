import _throw from "@swc/helpers/lib/_throw.js";
// @declaration: true
function f(a, param) {
    var param = param !== null ? param : _throw(new TypeError("Cannot destructure undefined"));
    var x, y, z;
}
