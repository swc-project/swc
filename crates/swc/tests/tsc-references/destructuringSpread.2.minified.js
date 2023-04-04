//// [destructuringSpread.ts]
import { _ as _object_spread } from "@swc/helpers/_/_object_spread";
import { _ as _object_spread_props } from "@swc/helpers/_/_object_spread_props";
_object_spread_props(_object_spread({}, {}), {
    x: 0
}).x, _object_spread({
    y: 0
}, {}).y;
var _$_object_spread = _object_spread({
    z: 0
}, {
    a: 0,
    b: 0
});
_$_object_spread.z, _$_object_spread.a, _$_object_spread.b;
var _$_object_spread_props = _object_spread_props(_object_spread({}, _object_spread_props(_object_spread({}, _object_spread_props(_object_spread({}, {
    c: 0
}), {
    d: 0
})), {
    e: 0
})), {
    f: 0
});
_$_object_spread_props.c, _$_object_spread_props.d, _$_object_spread_props.e, _$_object_spread_props.f, _$_object_spread_props.g;
