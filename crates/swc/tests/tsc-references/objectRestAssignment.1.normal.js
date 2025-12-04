//// [objectRestAssignment.ts]
import { _ as _extends } from "@swc/helpers/_/_extends";
import { _ as _object_without_properties } from "@swc/helpers/_/_object_without_properties";
let ka;
let nested;
let other;
let rest;
let complex;
({ x: _ref, y: other } = complex), ({ ka } = _ref), nested = _object_without_properties(_ref, [
    "ka"
]), rest = _object_without_properties(complex, [
    "x",
    "y"
]), complex;
var _ref;
// should be:
let overEmit;
// var _g = overEmit.a, [_h, ...y] = _g, nested2 = __rest(_h, []), _j = overEmit.b, { z } = _j, c = __rest(_j, ["z"]), rest2 = __rest(overEmit, ["a", "b"]);
var { a: [_ref1, ..._rest1], b: _ref2 } = overEmit, {} = _ref1, nested2 = _extends({}, _ref1), { z } = _ref2, c = _object_without_properties(_ref2, [
    "z"
]), rest2 = _object_without_properties(overEmit, [
    "a",
    "b"
]), [...y] = _rest1;
({ a: [_ref3, ..._rest], b: _ref4 } = overEmit), ({} = _ref3), nested2 = _extends({}, _ref3), ({ z } = _ref4), c = _object_without_properties(_ref4, [
    "z"
]), rest2 = _object_without_properties(overEmit, [
    "a",
    "b"
]), [...y] = _rest, overEmit;
var _ref3, _ref4;
