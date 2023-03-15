//// [objectSpreadComputedProperty.ts]
// fixes #12200
import _define_property from "@swc/helpers/src/_define_property.mjs";
import _extends from "@swc/helpers/src/_extends.mjs";
import _object_spread_props from "@swc/helpers/src/_object_spread_props.mjs";
function f() {
    var n = 12;
    var m = 13;
    var a = null;
    var o1 = _object_spread_props(_extends({}, {}), _define_property({}, n, n));
    var o2 = _object_spread_props(_extends({}, {}), _define_property({}, a, n));
    var o3 = _object_spread_props(_extends(_object_spread_props(_extends(_define_property({}, a, n), {}), _define_property({}, n, n)), {}), _define_property({}, m, m));
}
