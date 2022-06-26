import _object_spread from "@swc/helpers/src/_object_spread.mjs";
import _object_without_properties from "@swc/helpers/src/_object_without_properties.mjs";
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
