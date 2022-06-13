import _object_spread from "@swc/helpers/src/_object_spread.mjs";
import _object_spread_props from "@swc/helpers/src/_object_spread_props.mjs";
var x = _object_spread_props(_object_spread({}, {}), {
    x: 0
}).x;
var y = _object_spread({
    y: 0
}, {}).y;
var ref = _object_spread({
    z: 0
}, {
    a: 0,
    b: 0
}), z = ref.z, a = ref.a, b = ref.b;
var ref1 = _object_spread_props(_object_spread({}, _object_spread_props(_object_spread({}, _object_spread_props(_object_spread({}, {
    c: 0
}), {
    d: 0
})), {
    e: 0
})), {
    f: 0
}), c = ref1.c, d = ref1.d, e = ref1.e, f = ref1.f, g = ref1.g;
