import * as swcHelpers from "@swc/helpers";
// @target: es2015
var ka;
var nested;
var other;
var rest;
var complex;
var _complex;
var ref;
_complex = complex, nested = swcHelpers.objectWithoutProperties(_complex.x, [
    "ka"
]), rest = swcHelpers.objectWithoutProperties(_complex, [
    "x",
    "y"
]), ref = _complex, ka = ref.x.ka, other = ref.y, ref, _complex;
// should be:
var overEmit;
// var _g = overEmit.a, [_h, ...y] = _g, nested2 = __rest(_h, []), _j = overEmit.b, { z } = _j, c = __rest(_j, ["z"]), rest2 = __rest(overEmit, ["a", "b"]);
var _a = swcHelpers.toArray(overEmit.a), ref1 = _a[0], ref1 = ref1 !== null ? ref1 : swcHelpers._throw(new TypeError("Cannot destructure undefined")), y = _a.slice(1), z = overEmit.b.z, nested2 = swcHelpers.extends({}, overEmit.a[0]), c = swcHelpers.objectWithoutProperties(overEmit.b, [
    "z"
]), rest2 = swcHelpers.objectWithoutProperties(overEmit, [
    "a",
    "b"
]);
var _overEmit;
var ref2, ref3, ref4;
_overEmit = overEmit, nested2 = swcHelpers.extends({}, _overEmit.a[0]), c = swcHelpers.objectWithoutProperties(_overEmit.b, [
    "z"
]), rest2 = swcHelpers.objectWithoutProperties(_overEmit, [
    "a",
    "b"
]), ref2 = _overEmit, ref3 = swcHelpers.toArray(ref2.a), ref4 = ref3[0], ref4, y = ref3.slice(1), ref3, z = ref2.b.z, ref2, _overEmit;
