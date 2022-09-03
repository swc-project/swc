//// [objectSpreadComputedProperty.ts]
import _define_property from "@swc/helpers/src/_define_property.mjs";
import _object_spread from "@swc/helpers/src/_object_spread.mjs";
import _object_spread_props from "@swc/helpers/src/_object_spread_props.mjs";
function f() {
    _object_spread_props(_object_spread({}, {}), _define_property({}, 12, 12)), _object_spread_props(_object_spread({}, {}), _define_property({}, null, 12)), _object_spread_props(_object_spread(_object_spread_props(_object_spread(_define_property({}, null, 12), {}), _define_property({}, 12, 12)), {}), _define_property({}, 13, 13));
}
