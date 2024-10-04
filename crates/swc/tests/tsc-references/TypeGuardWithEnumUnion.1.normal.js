//// [TypeGuardWithEnumUnion.ts]
import { _ as _type_of } from "@swc/helpers/_/_type_of";
var Color = /*#__PURE__*/ function(Color) {
    Color[Color["R"] = 0] = "R";
    Color[Color["G"] = 1] = "G";
    Color[Color["B"] = 2] = "B";
    return Color;
}(Color || {});
function f1(x) {
    if (typeof x === "number") {
        var y = x;
        var y;
    } else {
        var z = x;
        var z;
    }
}
function f2(x) {
    if ((typeof x === "undefined" ? "undefined" : _type_of(x)) === "object") {
        var y = x;
        var y;
    }
    if (typeof x === "number") {
        var z = x;
        var z;
    } else {
        var w = x;
        var w;
    }
    if (typeof x === "string") {
        var a = x;
        var a;
    } else {
        var b = x;
        var b;
    }
}
