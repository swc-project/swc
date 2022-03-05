import * as swcHelpers from "@swc/helpers";
// @target: es2015
let ka;
let nested;
let other;
let rest;
let complex;
var _complex;
_complex = complex, nested = swcHelpers.objectWithoutProperties(_complex.x, [
    "ka"
]), rest = swcHelpers.objectWithoutProperties(_complex, [
    "x",
    "y"
]), ({ x: { ka  } , y: other  } = _complex), _complex;
// should be:
let overEmit;
// var _g = overEmit.a, [_h, ...y] = _g, nested2 = __rest(_h, []), _j = overEmit.b, { z } = _j, c = __rest(_j, ["z"]), rest2 = __rest(overEmit, ["a", "b"]);
var { a: [{}, ...y] , b: { z  }  } = overEmit, nested2 = swcHelpers.extends({}, overEmit.a[0]), c = swcHelpers.objectWithoutProperties(overEmit.b, [
    "z"
]), rest2 = swcHelpers.objectWithoutProperties(overEmit, [
    "a",
    "b"
]);
var _overEmit;
_overEmit = overEmit, nested2 = swcHelpers.extends({}, _overEmit.a[0]), c = swcHelpers.objectWithoutProperties(_overEmit.b, [
    "z"
]), rest2 = swcHelpers.objectWithoutProperties(_overEmit, [
    "a",
    "b"
]), ({ a: [{}, ...y] , b: { z  }  } = _overEmit), _overEmit;
