import _object_spread from "@swc/helpers/lib/_object_spread.js";
import _object_spread_props from "@swc/helpers/lib/_object_spread_props.js";
_object_spread_props(_object_spread({}, {}), {
    x: 0
}).x, _object_spread({
    y: 0
}, {}).y;
var ref = _object_spread({
    z: 0
}, {
    a: 0,
    b: 0
});
ref.z, ref.a, ref.b;
var ref1 = _object_spread_props(_object_spread({}, _object_spread_props(_object_spread({}, _object_spread_props(_object_spread({}, {
    c: 0
}), {
    d: 0
})), {
    e: 0
})), {
    f: 0
});
ref1.c, ref1.d, ref1.e, ref1.f, ref1.g;
