import * as swcHelpers from "@swc/helpers";
swcHelpers.objectSpread({}, {}, {
    x: 0
}).x, swcHelpers.objectSpread({
    y: 0
}, {}).y;
var ref = swcHelpers.objectSpread({
    z: 0
}, {
    a: 0,
    b: 0
});
ref.z, ref.a, ref.b;
var ref1 = swcHelpers.objectSpread({}, swcHelpers.objectSpread({}, swcHelpers.objectSpread({}, {
    c: 0
}, {
    d: 0
}), {
    e: 0
}), {
    f: 0
});
ref1.c, ref1.d, ref1.e, ref1.f, ref1.g;
