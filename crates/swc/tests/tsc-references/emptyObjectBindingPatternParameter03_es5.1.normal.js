import * as swcHelpers from "@swc/helpers";
// @declaration: true
function f(param, a) {
    var param = param !== null ? param : swcHelpers._throw(new TypeError("Cannot destructure undefined"));
    var x, y, z;
}
