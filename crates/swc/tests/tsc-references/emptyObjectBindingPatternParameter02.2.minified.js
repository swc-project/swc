//// [emptyObjectBindingPatternParameter02.ts]
import _throw from "@swc/helpers/src/_throw.mjs";
function f(a, param) {
    var param = null !== param ? param : _throw(new TypeError("Cannot destructure undefined"));
}
