//// [emptyObjectBindingPatternParameter01.ts]
import _throw from "@swc/helpers/src/_throw.mjs";
function f(param) {
    var param = param !== null ? param : _throw(new TypeError("Cannot destructure undefined"));
    var x, y, z;
}
