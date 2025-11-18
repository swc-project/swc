//// [objectSpreadComputedProperty.ts]
// fixes #12200
import { _ as _define_property } from "@swc/helpers/_/_define_property";
import { _ as _object_spread } from "@swc/helpers/_/_object_spread";
import { _ as _object_spread_props } from "@swc/helpers/_/_object_spread_props";
function f() {
    var n = 12;
    var m = 13;
    var a = null;
    var o1 = _object_spread_props(_object_spread({}, {}), _define_property({}, n, n));
    var o2 = _object_spread_props(_object_spread({}, {}), _define_property({}, a, n));
    var o3 = _object_spread_props(_object_spread(_object_spread_props(_object_spread(_define_property({}, a, n), {}), _define_property({}, n, n)), {}), _define_property({}, m, m));
}
