//// [objectRestAssignment.ts]
import { _ as _extends } from "@swc/helpers/_/_extends";
import { _ as _object_without_properties } from "@swc/helpers/_/_object_without_properties";
let ka;
let nested;
let other;
let rest;
let complex;
({ x: _ref } = complex), ({ ka } = _ref), nested = _object_without_properties(_ref, [
    "ka"
]), ({ y: other } = complex), rest = _object_without_properties(complex, [
    "x",
    "y"
]), complex;
var _ref;
// should be:
let overEmit;
// var _g = overEmit.a, [_h, ...y] = _g, nested2 = __rest(_h, []), _j = overEmit.b, { z } = _j, c = __rest(_j, ["z"]), rest2 = __rest(overEmit, ["a", "b"]);
var { a: _ref1 } = overEmit, [_ref2, ..._rest] = _ref1, {} = _ref2, nested2 = _extends({}, _ref2), [...y] = _rest, { b: _ref3 } = overEmit, { z } = _ref3, c = _object_without_properties(_ref3, [
    "z"
]), rest2 = _object_without_properties(overEmit, [
    "a",
    "b"
]);
({ a: _ref4 } = overEmit), [_ref5, ..._rest1] = _ref4, ({} = _ref5), nested2 = _extends({}, _ref5), [...y] = _rest1, ({ b: _ref6 } = overEmit), ({ z } = _ref6), c = _object_without_properties(_ref6, [
    "z"
]), rest2 = _object_without_properties(overEmit, [
    "a",
    "b"
]), overEmit;
var _ref4, _ref5, _rest1, _ref6;
