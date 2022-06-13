import _extends from "@swc/helpers/src/_extends.mjs";
import _object_without_properties from "@swc/helpers/src/_object_without_properties.mjs";
import _throw from "@swc/helpers/src/_throw.mjs";
import _to_array from "@swc/helpers/src/_to_array.mjs";
// @target: es2015
var ka;
var nested;
var other;
var rest;
var complex;
var _complex;
var ref;
_complex = complex, nested = _object_without_properties(_complex.x, [
    "ka"
]), rest = _object_without_properties(_complex, [
    "x",
    "y"
]), ref = _complex, ka = ref.x.ka, other = ref.y, ref, _complex;
// should be:
var overEmit;
// var _g = overEmit.a, [_h, ...y] = _g, nested2 = __rest(_h, []), _j = overEmit.b, { z } = _j, c = __rest(_j, ["z"]), rest2 = __rest(overEmit, ["a", "b"]);
var _a = _to_array(overEmit.a), ref1 = _a[0], ref1 = ref1 !== null ? ref1 : _throw(new TypeError("Cannot destructure undefined")), y = _a.slice(1), z = overEmit.b.z, nested2 = _extends({}, overEmit.a[0]), c = _object_without_properties(overEmit.b, [
    "z"
]), rest2 = _object_without_properties(overEmit, [
    "a",
    "b"
]);
var _overEmit;
var ref2, ref3, ref4;
_overEmit = overEmit, nested2 = _extends({}, _overEmit.a[0]), c = _object_without_properties(_overEmit.b, [
    "z"
]), rest2 = _object_without_properties(_overEmit, [
    "a",
    "b"
]), ref2 = _overEmit, ref3 = _to_array(ref2.a), ref4 = ref3[0], ref4, y = ref3.slice(1), ref3, z = ref2.b.z, ref2, _overEmit;
