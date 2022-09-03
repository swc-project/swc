//// [spreadUnion2.ts]
import _object_spread from "@swc/helpers/src/_object_spread.mjs";
var o1, o2, o3, o4, o5, o1 = _object_spread({}, undefinedUnion), o2 = _object_spread({}, nullUnion), o3 = _object_spread({}, undefinedUnion, nullUnion), o3 = _object_spread({}, nullUnion, undefinedUnion), o4 = _object_spread({}, undefinedUnion, undefinedUnion), o5 = _object_spread({}, nullUnion, nullUnion);
