// @strictNullChecks: true
import _object_spread from "@swc/helpers/src/_object_spread.mjs";
var o1;
var o1 = _object_spread({}, undefinedUnion);
var o2;
var o2 = _object_spread({}, nullUnion);
var o3;
var o3 = _object_spread({}, undefinedUnion, nullUnion);
var o3 = _object_spread({}, nullUnion, undefinedUnion);
var o4;
var o4 = _object_spread({}, undefinedUnion, undefinedUnion);
var o5;
var o5 = _object_spread({}, nullUnion, nullUnion);
