import * as swcHelpers from "@swc/helpers";
var x = swcHelpers.objectSpread({}, {}, {
    x: 0
}).x;
var y = swcHelpers.objectSpread({
    y: 0
}, {}).y;
var ref = swcHelpers.objectSpread({
    z: 0
}, {
    a: 0,
    b: 0
}), z = ref.z, a = ref.a, b = ref.b;
var ref1 = swcHelpers.objectSpread({}, swcHelpers.objectSpread({}, swcHelpers.objectSpread({}, {
    c: 0
}, {
    d: 0
}), {
    e: 0
}), {
    f: 0
}), c = ref1.c, d = ref1.d, e = ref1.e, f = ref1.f, g = ref1.g;
