import * as swcHelpers from "@swc/helpers";
var ref = {
    a1: 10,
    a2: "world"
};
ref.a1, ref.a2;
var tmp = {
    b11: "world"
};
(void 0 === tmp ? {
    b11: "string"
} : tmp).b11;
var ref1 = [
    void 0,
    void 0,
    void 0
], ref2 = (ref1[0], ref1[1], ref1[2], swcHelpers.slicedToArray([
    1,
    "string"
].concat(swcHelpers.toConsumableArray([
    !0,
    !1,
    !0
])), 2));
ref2[0], ref2[1];
var _e = swcHelpers.slicedToArray([
    1,
    2,
    {
        b1: 4,
        b4: 0
    }
], 3), _f = (_e[0], _e[1], _e[2], swcHelpers.slicedToArray([
    1,
    2,
    {
        f3: 4,
        f5: 0
    }
], 3)), ref3 = (_f[0], _f[1], _f[2]);
ref3.f3, ref3.f5;
