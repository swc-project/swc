//// [objectRestAssignment.ts]
let ka, other, complex, overEmit;
import { _ as _extends } from "@swc/helpers/_/_extends";
import { _ as _object_without_properties } from "@swc/helpers/_/_object_without_properties";
({ x: _ref, y: other } = complex), ({ ka } = _ref), _object_without_properties(_ref, [
    "ka"
]), _object_without_properties(complex, [
    "x",
    "y"
]);
var _ref, _ref3, _ref4, { a: [_ref1, ..._rest1], b: _ref2 } = overEmit, {} = _ref1, { z } = (_extends({}, _ref1), _ref2), [...y] = (_object_without_properties(_ref2, [
    "z"
]), _object_without_properties(overEmit, [
    "a",
    "b"
]), _rest1);
({ a: [_ref3, ..._rest], b: _ref4 } = overEmit), _extends({}, _ref3), ({ z } = _ref4), _object_without_properties(_ref4, [
    "z"
]), _object_without_properties(overEmit, [
    "a",
    "b"
]), [...y] = _rest;
