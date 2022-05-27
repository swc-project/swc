import _object_spread from "@swc/helpers/lib/_object_spread.js";
import _object_spread_props from "@swc/helpers/lib/_object_spread_props.js";
let a1 = {
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
let a2 = {
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
let b2 = _object_spread_props(_object_spread({}, b1), {
    z: 55
});
_object_spread({}, b2);
let d1 = {
    kind: 'a',
    pos: {
        x: 0,
        y: 0
    }
};
d1.kind, d1.pos, d1.pos.x, d1.pos.y, d1.pos.a, d1.pos.b, f({
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
