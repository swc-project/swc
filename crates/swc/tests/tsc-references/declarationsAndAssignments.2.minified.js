//// [declarationsAndAssignments.ts]
var M;
import _sliced_to_array from "@swc/helpers/src/_sliced_to_array.mjs";
import _throw from "@swc/helpers/src/_throw.mjs";
import _to_array from "@swc/helpers/src/_to_array.mjs";
function f0() {
    var ref = [
        1,
        "hello"
    ];
    ref[0], ref[1], ref[2];
}
function f1() {
    var a = [
        1,
        "hello"
    ];
    _sliced_to_array(a, 1)[0];
    var _a = _sliced_to_array(a, 2);
    _a[0], _a[1];
    var _a1 = _sliced_to_array(a, 3);
    _a1[0], _a1[1], _a1[2];
}
function f2() {
    var ref = {
        x: 5,
        y: "hello"
    }, ref = null !== ref ? ref : _throw(new TypeError("Cannot destructure undefined")), ref1 = {
        x: 5,
        y: "hello"
    };
    ref1.x, ref1.y;
    var ref2 = {
        x: 5,
        y: "hello"
    };
    ref2.x, ref2.y;
}
function f3() {}
function f4() {
    var ref = {
        a: 1,
        b: {
            a: "hello",
            b: {
                a: !0
            }
        }
    }, _b = (ref.a, ref.b);
    (_b.a, _b.b).a;
}
function f6() {}
function f7() {}
function f8() {
    var ref = [];
    ref[0], ref[1], ref[2];
    var ref1 = [
        1
    ];
    ref1[0], ref1[1], ref1[2];
}
function f9() {
    var ref = _sliced_to_array({}, 2);
    ref[0], ref[1];
    var ref1 = _sliced_to_array({
        0: 10,
        1: 20
    }, 2);
    ref1[0], ref1[1];
}
function f10() {
    var ref = {};
    ref.a, ref.b;
}
function f11() {
    var ref = {
        x: 10,
        y: "hello"
    };
    ref.x, ref.y;
    var ref1 = {
        0: 10,
        1: "hello"
    };
    ref1[0], ref1[1];
    var ref2 = {
        "<": 10,
        ">": "hello"
    };
    ref2["<"], ref2[">"];
    var ref3 = [
        10,
        "hello"
    ];
    ref3[0], ref3[1];
}
function f12() {
    var tmp = [
        "hello",
        {
            x: 5,
            y: !0
        }
    ], ref = _sliced_to_array(void 0 === tmp ? [
        "abc",
        {
            x: 10,
            y: !1
        }
    ] : tmp, 2), ref1 = (ref[0], ref[1]);
    ref1.x, ref1.y;
}
function f13() {
    var y = "hello", ref = [
        [
            1,
            y
        ],
        {
            x: 1,
            y: y
        }
    ];
    ref[0], ref[1];
}
function f14(param) {
    var _param = _sliced_to_array(param, 2), ref = (_param[0], _sliced_to_array(_param[1], 2)), ref1 = (ref[0], ref[1]);
    ref1.x, ref1.y;
}
function f15() {
    return {
        a: "hello",
        b: 1,
        c: !0
    };
}
function f16() {
    var ref = f15();
    ref.a, ref.b, ref.c;
}
function f17(param) {
    param.a, param.b, param.c;
}
function f18() {
    var a, b, aa, ref, ref1, ref2, ref3;
    a = (ref = {
        a: a,
        b: b
    }).a, ref2 = [
        a = (ref1 = {
            b: b = ref.b,
            a: a
        }).a,
        b = ref1.b
    ], aa[0] = ref2[0], a = (ref3 = [
        b = ref2[1],
        a
    ])[0], b = ref3[1], a = 2, b = "def";
}
function f19() {
    var a, ref, ref1, ref2, ref3;
    a = (ref = [
        2,
        a = 1
    ])[0], a = (ref1 = {
        b: ref[1],
        a: a
    }).a, ref1.b, a = (ref2 = _sliced_to_array([
        2,
        3
    ], 2))[0], ref2[1], a = (ref3 = [
        1,
        2
    ])[0], ref3[1];
}
function f20(v) {
    _to_array(v).slice(0);
    var ref, ref1, ref2, _v = _to_array(v), _v1 = (_v[0], _v.slice(1), _to_array(v)), _v2 = (_v1[0], _v1[1], _v1.slice(2), _to_array(v));
    _v2[0], _v2[1], _v2[2], _v2.slice(3), _to_array(v).slice(0), (ref = _to_array(v))[0], ref.slice(1), (ref1 = _to_array(v))[0], ref1[1], ref1.slice(2), (ref2 = _to_array(v))[0], ref2[1], ref2[2], ref2.slice(3);
}
function f21(v) {
    _to_array(v).slice(0);
    var ref, ref1, ref2, _v = _to_array(v), _v1 = (_v[0], _v.slice(1), _to_array(v)), _v2 = (_v1[0], _v1[1], _v1.slice(2), _to_array(v));
    _v2[0], _v2[1], _v2[2], _v2.slice(3), _to_array(v).slice(0), (ref = _to_array(v))[0], ref.slice(1), (ref1 = _to_array(v))[0], ref1[1], ref1.slice(2), (ref2 = _to_array(v))[0], ref2[1], ref2[2], ref2.slice(3);
}
f14([
    2,
    [
        "abc",
        {
            x: 0,
            y: !0
        }
    ]
]), f14([
    2,
    [
        "abc",
        {
            x: 0
        }
    ]
]), f14([
    2,
    [
        "abc",
        {
            y: !1
        }
    ]
]), function(M) {
    M.a = 1, M.b = 2;
}(M || (M = {})), f17({}), f17({
    a: "hello"
}), f17({
    c: !0
}), f17(f15());
