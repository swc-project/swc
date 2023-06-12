//// [objectRestAssignment.ts]
let ka, other, complex, overEmit;
import { _ as _extends } from "@swc/helpers/_/_extends";
import { _ as _object_destructuring_empty } from "@swc/helpers/_/_object_destructuring_empty";
import { _ as _object_without_properties } from "@swc/helpers/_/_object_without_properties";
_object_without_properties((_complex = complex).x, [
    "ka"
]), _object_without_properties(_complex, [
    "x",
    "y"
]), { x: { ka }, y: other } = _complex;
var _complex, _overEmit, { a: [{}, ...y], b: { z } } = overEmit;
_extends({}, _object_destructuring_empty(overEmit.a[0])), _object_without_properties(overEmit.b, [
    "z"
]), _object_without_properties(overEmit, [
    "a",
    "b"
]), _extends({}, _object_destructuring_empty((_overEmit = overEmit).a[0])), _object_without_properties(_overEmit.b, [
    "z"
]), _object_without_properties(_overEmit, [
    "a",
    "b"
]), { a: [{}, ...y], b: { z } } = _overEmit;
