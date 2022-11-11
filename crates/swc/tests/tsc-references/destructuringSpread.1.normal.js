//// [destructuringSpread.ts]
import _object_spread from "@swc/helpers/src/_object_spread.mjs";
import _object_spread_props from "@swc/helpers/src/_object_spread_props.mjs";
var x = _object_spread_props(_object_spread({}, {}), {
    x: 0
}).x;
var y = _object_spread({
    y: 0
}, {}).y;
var _$_object_spread = _object_spread({
    z: 0
}, {
    a: 0,
    b: 0
}), z = _$_object_spread.z, a = _$_object_spread.a, b = _$_object_spread.b;
var _$_object_spread_props = _object_spread_props(_object_spread({}, _object_spread_props(_object_spread({}, _object_spread_props(_object_spread({}, {
    c: 0
}), {
    d: 0
})), {
    e: 0
})), {
    f: 0
}), c = _$_object_spread_props.c, d = _$_object_spread_props.d, e = _$_object_spread_props.e, f = _$_object_spread_props.f, g = _$_object_spread_props.g;
