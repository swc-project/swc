import _object_spread from "@swc/helpers/lib/_object_spread.js";
import _object_without_properties from "@swc/helpers/lib/_object_without_properties.js";
// @target: esnext
var y = {
    a: "yes",
    b: "no"
};
var o = _object_spread({
    x: 1
}, y);
var b;
var rest;
var _o;
_o = o, rest = _object_without_properties(_o, [
    "b"
]), b = _o.b, _o;
