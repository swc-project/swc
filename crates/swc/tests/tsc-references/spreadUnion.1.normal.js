//// [spreadUnion.ts]
import { _ as _object_spread } from "@swc/helpers/_/_object_spread";
import { _ as _object_spread_props } from "@swc/helpers/_/_object_spread_props";
var union;
var o3;
var o3 = _object_spread({}, union);
var o4;
var o4 = _object_spread_props(_object_spread({}, union), {
    a: false
});
var o5;
var o5 = _object_spread({}, union, union);
