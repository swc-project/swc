import _throw from "@swc/helpers/src/_throw.mjs";
// @declaration: true
function f() {
    var ref = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {
        a: 1,
        b: "2",
        c: true
    }, ref = ref !== null ? ref : _throw(new TypeError("Cannot destructure undefined"));
    var x, y, z;
}
