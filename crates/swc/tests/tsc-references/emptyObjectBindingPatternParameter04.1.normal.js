//// [emptyObjectBindingPatternParameter04.ts]
import _throw from "@swc/helpers/src/_throw.mjs";
function f() {
    var _ref = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {
        a: 1,
        b: "2",
        c: true
    }, _ref = _ref !== null ? _ref : _throw(new TypeError("Cannot destructure undefined"));
    var x, y, z;
}
