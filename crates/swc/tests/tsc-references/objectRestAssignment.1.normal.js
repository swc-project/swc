//// [objectRestAssignment.ts]
import { _ as _extends } from "@swc/helpers/_/_extends";
import { _ as _object_without_properties } from "@swc/helpers/_/_object_without_properties";
var _ref, _ref1, _ref2, _ref3, _ref4, _rest, _ref5;
let ka;
let nested;
let other;
let rest;
let complex;
_ref = complex, ({ x: _ref1 } = _ref), ({ ka } = _ref1), nested = _object_without_properties(_ref1, [
    "ka"
]), ({ y: other } = _ref), rest = _object_without_properties(_ref, [
    "x",
    "y"
]), _ref;
// should be:
let overEmit;
// var _g = overEmit.a, [_h, ...y] = _g, nested2 = __rest(_h, []), _j = overEmit.b, { z } = _j, c = __rest(_j, ["z"]), rest2 = __rest(overEmit, ["a", "b"]);
var { a: _ref6 } = overEmit, [_ref7, ..._rest1] = _ref6, {} = _ref7, nested2 = _extends({}, _ref7), [...y] = _rest1, { b: _ref8 } = overEmit, { z } = _ref8, c = _object_without_properties(_ref8, [
    "z"
]), rest2 = _object_without_properties(overEmit, [
    "a",
    "b"
]);
_ref2 = overEmit, ({ a: _ref3 } = _ref2), [_ref4, ..._rest] = _ref3, ({} = _ref4), nested2 = _extends({}, _ref4), [...y] = _rest, ({ b: _ref5 } = _ref2), ({ z } = _ref5), c = _object_without_properties(_ref5, [
    "z"
]), rest2 = _object_without_properties(_ref2, [
    "a",
    "b"
]), _ref2;
