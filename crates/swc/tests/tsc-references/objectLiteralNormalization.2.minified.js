//// [objectLiteralNormalization.ts]
import { _ as _object_spread } from "@swc/helpers/_/_object_spread";
import { _ as _object_spread_props } from "@swc/helpers/_/_object_spread_props";
var a1 = {
    a: 0
};
a1.a, a1.b, a1.c, a1 = {
    a: 1
}, a1 = {
    a: 0,
    b: 0
}, a1 = {
    b: "y"
}, a1 = {
    c: !0
};
var a2 = {
    a: 1,
    b: 2
};
a2.a, a2.b, a2 = {
    a: 10,
    b: 20
}, a2 = {
    a: "def"
}, a2 = {}, a2 = {
    a: "def",
    b: 20
}, a2 = {
    a: 1
};
var b2 = _object_spread_props(_object_spread({}, b1), {
    z: 55
});
_object_spread({}, b2), opts;
var d1_pos = {
    x: 0,
    y: 0
};
d1_pos.x, d1_pos.y, d1_pos.a, d1_pos.b, f({
    a: 1,
    b: 2
}, {
    a: "abc"
}, {}), f({}, {
    a: "abc"
}, {
    a: 1,
    b: 2
}), f(data, {
    a: 2
}), f({
    a: 2
}, data);
