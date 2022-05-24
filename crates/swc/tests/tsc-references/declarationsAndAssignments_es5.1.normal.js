import _sliced_to_array from "@swc/helpers/lib/_sliced_to_array.js";
import _throw from "@swc/helpers/lib/_throw.js";
import _to_array from "@swc/helpers/lib/_to_array.js";
function f0() {
    var ref = [
        1,
        "hello"
    ];
    var ref1 = [
        1,
        "hello"
    ], x = ref1[0];
    var x = 1, y = "hello";
    var ref2 = [
        1,
        "hello"
    ], x = ref2[0], y = ref2[1], z = ref2[2];
    var x = 2;
    var x;
    var y;
}
function f1() {
    var a = [
        1,
        "hello"
    ];
    var _a = _sliced_to_array(a, 1), x = _a[0];
    var _a1 = _sliced_to_array(a, 2), x = _a1[0], y = _a1[1];
    var _a2 = _sliced_to_array(a, 3), x = _a2[0], y = _a2[1], z = _a2[2];
    var x;
    var y;
    var z;
}
function f2() {
    var ref = {
        x: 5,
        y: "hello"
    }, ref = ref !== null ? ref : _throw(new TypeError("Cannot destructure undefined")); // Error, no x and y in target
    var x = {
        x: 5,
        y: "hello"
    }.x; // Error, no y in target
    var y = {
        x: 5,
        y: "hello"
    }.y; // Error, no x in target
    var ref3 = {
        x: 5,
        y: "hello"
    }, x = ref3.x, y = ref3.y;
    var x;
    var y;
    var ref4 = {
        x: 5,
        y: "hello"
    }, a = ref4.x; // Error, no y in target
    var ref5 = {
        x: 5,
        y: "hello"
    }, b = ref5.y; // Error, no x in target
    var ref6 = {
        x: 5,
        y: "hello"
    }, a = ref6.x, b = ref6.y;
    var a;
    var b;
}
function f3() {
    var x = 1, y = "hello", z = true;
    var x;
    var y;
    var z;
}
function f4() {
    var ref = {
        a: 1,
        b: {
            a: "hello",
            b: {
                a: true
            }
        }
    }, x = ref.a, _b = ref.b, y = _b.a, _b1 = _b.b, z = _b1.a;
    var x;
    var y;
    var z;
}
function f6() {
    var tmp = 1, x = tmp === void 0 ? 0 : tmp, tmp1 = "hello", y = tmp1 === void 0 ? "" : tmp1;
    var x;
    var y;
}
function f7() {
    var tmp = 1, x = tmp === void 0 ? 0 : tmp, tmp2 = "hello", y = tmp2 === void 0 ? 1 : tmp2; // Error, initializer for y must be string
    var x;
    var y;
}
function f8() {
    var ref = [], a = ref[0], b = ref[1], c = ref[2]; // Error, [] is an empty tuple
    var ref7 = [
        1
    ], d = ref7[0], e = ref7[1], f = ref7[2]; // Error, [1] is a tuple
}
function f9() {
    var ref = _sliced_to_array({}, 2), a = ref[0], b = ref[1]; // Error, not array type
    var ref8 = _sliced_to_array({
        0: 10,
        1: 20
    }, 2), c = ref8[0], d = ref8[1]; // Error, not array type
    var e = 10, f = 20;
}
function f10() {
    var ref = {}, a = ref.a, b = ref.b; // Error
    var ref9 = [], a = ref9.a, b = ref9.b; // Error
}
function f11() {
    var ref = {
        x: 10,
        y: "hello"
    }, a = ref.x, b = ref.y;
    var ref10 = {
        0: 10,
        1: "hello"
    }, a = ref10[0], b = ref10[1];
    var ref11 = {
        "<": 10,
        ">": "hello"
    }, a = ref11["<"], b = ref11[">"];
    var ref12 = [
        10,
        "hello"
    ], a = ref12[0], b = ref12[1];
    var a;
    var b;
}
function f12() {
    var a = 1, tmp = [
        "hello",
        {
            x: 5,
            y: true
        }
    ], ref = _sliced_to_array(tmp === void 0 ? [
        "abc",
        {
            x: 10,
            y: false
        }
    ] : tmp, 2), b = ref[0], ref13 = ref[1], x = ref13.x, c = ref13.y;
    var a;
    var b;
    var x;
    var c;
}
function f13() {
    var x = 1, y = "hello";
    var ref = [
        [
            x,
            y
        ],
        {
            x: x,
            y: y
        }
    ], a = ref[0], b = ref[1];
}
function f14(param) {
    var _param = _sliced_to_array(param, 2), tmp = _param[0], a = tmp === void 0 ? 1 : tmp, ref = _sliced_to_array(_param[1], 2), tmp3 = ref[0], b = tmp3 === void 0 ? "hello" : tmp3, ref14 = ref[1], x = ref14.x, tmp4 = ref14.y, c = tmp4 === void 0 ? false : tmp4;
    var a;
    var b;
    var c;
}
f14([
    2,
    [
        "abc",
        {
            x: 0,
            y: true
        }
    ]
]);
f14([
    2,
    [
        "abc",
        {
            x: 0
        }
    ]
]);
f14([
    2,
    [
        "abc",
        {
            y: false
        }
    ]
]); // Error, no x
var M;
(function(M1) {
    M1.a = 1, M1.b = 2;
})(M || (M = {}));
function f15() {
    var a = "hello";
    var b = 1;
    var c = true;
    return {
        a: a,
        b: b,
        c: c
    };
}
function f16() {
    var ref = f15(), a = ref.a, b = ref.b, c = ref.c;
}
function f17(param) {
    var _a = param.a, a = _a === void 0 ? "" : _a, _b = param.b, b = _b === void 0 ? 0 : _b, _c = param.c, c = _c === void 0 ? false : _c;
}
f17({});
f17({
    a: "hello"
});
f17({
    c: true
});
f17(f15());
function f18() {
    var a;
    var b;
    var aa;
    var ref;
    ref = {
        a: a,
        b: b
    }, a = ref.a, b = ref.b, ref;
    var ref15;
    ref15 = {
        b: b,
        a: a
    }, a = ref15.a, b = ref15.b, ref15;
    var ref16;
    ref16 = [
        a,
        b
    ], aa[0] = ref16[0], b = ref16[1], ref16;
    var ref17;
    ref17 = [
        b,
        a
    ], a = ref17[0], b = ref17[1], ref17; // Error
    var ref18, ref19;
    ref18 = 2, a = ref18 === void 0 ? 1 : ref18, ref19 = "def", b = ref19 === void 0 ? "abc" : ref19;
}
function f19() {
    var a, b;
    a = 1, b = 2;
    var ref;
    ref = [
        b,
        a
    ], a = ref[0], b = ref[1], ref;
    var ref20;
    ref20 = {
        b: b,
        a: a
    }, a = ref20.a, b = ref20.b, ref20;
    var ref21, ref22;
    ref21 = [
        2,
        3
    ], ref22 = _sliced_to_array(ref21 === void 0 ? [
        1,
        2
    ] : ref21, 2), a = ref22[0], b = ref22[1], ref22;
    var ref23;
    var x = (ref23 = [
        1,
        2
    ], a = ref23[0], b = ref23[1], ref23);
}
function f20(v) {
    var x;
    var y;
    var z;
    var a0;
    var a1;
    var a2;
    var a3;
    var _v = _to_array(v), a3 = _v.slice(0);
    var _v1 = _to_array(v), x = _v1[0], a2 = _v1.slice(1);
    var _v2 = _to_array(v), x = _v2[0], y = _v2[1], a1 = _v2.slice(2);
    var _v3 = _to_array(v), x = _v3[0], y = _v3[1], z = _v3[2], a0 = _v3.slice(3);
    var ref;
    ref = _to_array(v), a3 = ref.slice(0), ref;
    var ref24;
    ref24 = _to_array(v), x = ref24[0], a2 = ref24.slice(1), ref24;
    var ref25;
    ref25 = _to_array(v), x = ref25[0], y = ref25[1], a1 = ref25.slice(2), ref25;
    var ref26;
    ref26 = _to_array(v), x = ref26[0], y = ref26[1], z = ref26[2], a0 = ref26.slice(3), ref26;
}
function f21(v) {
    var x;
    var y;
    var z;
    var a0;
    var a1;
    var a2;
    var a3;
    var _v = _to_array(v), a0 = _v.slice(0);
    var _v4 = _to_array(v), x = _v4[0], a1 = _v4.slice(1);
    var _v5 = _to_array(v), x = _v5[0], y = _v5[1], a2 = _v5.slice(2);
    var _v6 = _to_array(v), x = _v6[0], y = _v6[1], z = _v6[2], a3 = _v6.slice(3);
    var ref;
    ref = _to_array(v), a0 = ref.slice(0), ref;
    var ref27;
    ref27 = _to_array(v), x = ref27[0], a1 = ref27.slice(1), ref27;
    var ref28;
    ref28 = _to_array(v), x = ref28[0], y = ref28[1], a2 = ref28.slice(2), ref28;
    var ref29;
    ref29 = _to_array(v), x = ref29[0], y = ref29[1], z = ref29[2], a3 = ref29.slice(3), ref29;
}
