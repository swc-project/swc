//// [destructuringSpread.ts]
import _extends from "@swc/helpers/src/_extends.mjs";
import _object_spread_props from "@swc/helpers/src/_object_spread_props.mjs";
_object_spread_props(_extends({}, {}), {
    x: 0
}).x, _extends({
    y: 0
}, {}).y;
var _$_extends = _extends({
    z: 0
}, {
    a: 0,
    b: 0
});
_$_extends.z, _$_extends.a, _$_extends.b;
var _$_object_spread_props = _object_spread_props(_extends({}, _object_spread_props(_extends({}, _object_spread_props(_extends({}, {
    c: 0
}), {
    d: 0
})), {
    e: 0
})), {
    f: 0
});
_$_object_spread_props.c, _$_object_spread_props.d, _$_object_spread_props.e, _$_object_spread_props.f, _$_object_spread_props.g;
