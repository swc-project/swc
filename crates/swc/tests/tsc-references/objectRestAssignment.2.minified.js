//// [objectRestAssignment.ts]
import _extends from "@swc/helpers/src/_extends.mjs";
import _object_without_properties from "@swc/helpers/src/_object_without_properties.mjs";
let ka, nested, other, rest, complex;
nested = _object_without_properties((_complex = complex).x, [
    "ka"
]), rest = _object_without_properties(_complex, [
    "x",
    "y"
]), { x: { ka  } , y: other  } = _complex;
let overEmit;
var _complex, _overEmit, { a: [{}, ...y] , b: { z  }  } = overEmit, nested2 = _extends({}, overEmit.a[0]), c = _object_without_properties(overEmit.b, [
    "z"
]), rest2 = _object_without_properties(overEmit, [
    "a",
    "b"
]);
nested2 = _extends({}, (_overEmit = overEmit).a[0]), c = _object_without_properties(_overEmit.b, [
    "z"
]), rest2 = _object_without_properties(_overEmit, [
    "a",
    "b"
]), { a: [{}, ...y] , b: { z  }  } = _overEmit;
