//// [destructuringSpread.ts]
import _extends from "@swc/helpers/src/_extends.mjs";
import _object_spread_props from "@swc/helpers/src/_object_spread_props.mjs";
var x = _object_spread_props(_extends({}, {}), {
    x: 0
}).x;
var y = _extends({
    y: 0
}, {}).y;
var _$_extends = _extends({
    z: 0
}, {
    a: 0,
    b: 0
}), z = _$_extends.z, a = _$_extends.a, b = _$_extends.b;
var _$_object_spread_props = _object_spread_props(_extends({}, _object_spread_props(_extends({}, _object_spread_props(_extends({}, {
    c: 0
}), {
    d: 0
})), {
    e: 0
})), {
    f: 0
}), c = _$_object_spread_props.c, d = _$_object_spread_props.d, e = _$_object_spread_props.e, f = _$_object_spread_props.f, g = _$_object_spread_props.g;
