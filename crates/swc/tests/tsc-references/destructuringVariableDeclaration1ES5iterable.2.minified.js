//// [destructuringVariableDeclaration1ES5iterable.ts]
import _sliced_to_array from "@swc/helpers/src/_sliced_to_array.mjs";
import _to_consumable_array from "@swc/helpers/src/_to_consumable_array.mjs";
var ref = {
    a1: 10,
    a2: "world"
}, a1 = ref.a1, a2 = ref.a2, a3 = 1, a4 = "hello", a5 = !0, ref1 = {
    b1: {
        b11: "world"
    }
}, tmp = ref1.b1, b11 = (void 0 === tmp ? {
    b11: "string"
} : tmp).b11, temp = {
    t1: !0,
    t2: "false"
}, tmp1 = 3, b2 = void 0 === tmp1 ? 3 : tmp1, tmp2 = !1, b3 = void 0 === tmp2 || tmp2, tmp3 = {
    t1: !1,
    t2: "hello"
}, b4 = void 0 === tmp3 ? temp : tmp3, ref2 = [
    void 0,
    void 0,
    void 0
], tmp4 = ref2[0], b5 = void 0 === tmp4 ? 3 : tmp4, tmp5 = ref2[1], b6 = void 0 === tmp5 || tmp5, tmp6 = ref2[2], b7 = void 0 === tmp6 ? temp : tmp6, c1 = [
    1,
    2,
    3
], c2 = [
    1,
    2,
    3,
    "string"
], d1 = 1, d2 = "string", temp1 = [
    !0,
    !1,
    !0
], ref3 = _sliced_to_array([
    1,
    "string"
].concat(_to_consumable_array(temp1)), 2), d3 = ref3[0], d4 = ref3[1], ref4 = {
    e: [
        1,
        2,
        {
            b1: 4,
            b4: 0
        }
    ]
}, _e = _sliced_to_array(ref4.e, 3), e1 = _e[0], e2 = _e[1], tmp7 = _e[2], e3 = void 0 === tmp7 ? {
    b1: 1000,
    b4: 200
} : tmp7, ref5 = {
    f: [
        1,
        2,
        {
            f3: 4,
            f5: 0
        }
    ]
}, _f = _sliced_to_array(ref5.f, 3), f1 = _f[0], f2 = _f[1], ref6 = _f[2], f4 = ref6.f3, f5 = ref6.f5, ref7 = {
    g: {
        g1: [
            1,
            2
        ]
    }
}, _g = ref7.g, _g1 = _g.g1, g1 = void 0 === _g1 ? [
    void 0,
    null
] : _g1, ref8 = {
    h: {
        h1: [
            1,
            2
        ]
    }
}, _h = ref8.h, _h1 = _h.h1, h1 = void 0 === _h1 ? [
    void 0,
    null
] : _h1;
