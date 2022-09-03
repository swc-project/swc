//// [emptyObjectBindingPatternParameter04.ts]
import _throw from "@swc/helpers/src/_throw.mjs";
function f() {
    var ref = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {
        a: 1,
        b: "2",
        c: !0
    }, ref = null !== ref ? ref : _throw(new TypeError("Cannot destructure undefined"));
}
