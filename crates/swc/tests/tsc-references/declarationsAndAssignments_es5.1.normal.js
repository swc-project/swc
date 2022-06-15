import _sliced_to_array from "@swc/helpers/src/_sliced_to_array.mjs";
import _throw from "@swc/helpers/src/_throw.mjs";
import _to_array from "@swc/helpers/src/_to_array.mjs";
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
    var ref1 = {
        x: 5,
        y: "hello"
    }, x = ref1.x, y = ref1.y;
    var x;
    var y;
    var ref2 = {
        x: 5,
        y: "hello"
    }, a = ref2.x; // Error, no y in target
    var ref3 = {
        x: 5,
        y: "hello"
    }, b = ref3.y; // Error, no x in target
    var ref4 = {
        x: 5,
        y: "hello"
    }, a = ref4.x, b = ref4.y;
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
    var tmp = 1, x = tmp === void 0 ? 0 : tmp, tmp1 = "hello", y = tmp1 === void 0 ? 1 : tmp1; // Error, initializer for y must be string
    var x;
    var y;
}
function f8() {
    var ref = [], a = ref[0], b = ref[1], c = ref[2]; // Error, [] is an empty tuple
    var ref1 = [
        1
    ], d = ref1[0], e = ref1[1], f = ref1[2]; // Error, [1] is a tuple
}
function f9() {
    var ref = _sliced_to_array({}, 2), a = ref[0], b = ref[1]; // Error, not array type
    var ref1 = _sliced_to_array({
        0: 10,
        1: 20
    }, 2), c = ref1[0], d = ref1[1]; // Error, not array type
    var e = 10, f = 20;
}
function f10() {
    var ref = {}, a = ref.a, b = ref.b; // Error
    var ref1 = [], a = ref1.a, b = ref1.b; // Error
}
function f11() {
    var ref = {
        x: 10,
        y: "hello"
    }, a = ref.x, b = ref.y;
    var ref1 = {
        0: 10,
        1: "hello"
    }, a = ref1[0], b = ref1[1];
    var ref2 = {
        "<": 10,
        ">": "hello"
    }, a = ref2["<"], b = ref2[">"];
    var ref3 = [
        10,
        "hello"
    ], a = ref3[0], b = ref3[1];
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
    ] : tmp, 2), b = ref[0], ref1 = ref[1], x = ref1.x, c = ref1.y;
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
    var _param = _sliced_to_array(param, 2), tmp = _param[0], a = tmp === void 0 ? 1 : tmp, ref = _sliced_to_array(_param[1], 2), tmp1 = ref[0], b = tmp1 === void 0 ? "hello" : tmp1, ref1 = ref[1], x = ref1.x, tmp2 = ref1.y, c = tmp2 === void 0 ? false : tmp2;
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
(function(M) {
    M.a = 1, M.b = 2;
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
    var ref1;
    ref1 = {
        b: b,
        a: a
    }, a = ref1.a, b = ref1.b, ref1;
    var ref2;
    ref2 = [
        a,
        b
    ], aa[0] = ref2[0], b = ref2[1], ref2;
    var ref3;
    ref3 = [
        b,
        a
    ], a = ref3[0], b = ref3[1], ref3; // Error
    var ref4, ref5;
    ref4 = 2, a = ref4 === void 0 ? 1 : ref4, ref5 = "def", b = ref5 === void 0 ? "abc" : ref5;
}
function f19() {
    var a, b;
    a = 1, b = 2;
    var ref;
    ref = [
        b,
        a
    ], a = ref[0], b = ref[1], ref;
    var ref1;
    ref1 = {
        b: b,
        a: a
    }, a = ref1.a, b = ref1.b, ref1;
    var ref2, ref3;
    ref2 = [
        2,
        3
    ], ref3 = _sliced_to_array(ref2 === void 0 ? [
        1,
        2
    ] : ref2, 2), a = ref3[0], b = ref3[1], ref3;
    var ref4;
    var x = (ref4 = [
        1,
        2
    ], a = ref4[0], b = ref4[1], ref4);
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
    var ref1;
    ref1 = _to_array(v), x = ref1[0], a2 = ref1.slice(1), ref1;
    var ref2;
    ref2 = _to_array(v), x = ref2[0], y = ref2[1], a1 = ref2.slice(2), ref2;
    var ref3;
    ref3 = _to_array(v), x = ref3[0], y = ref3[1], z = ref3[2], a0 = ref3.slice(3), ref3;
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
    var _v1 = _to_array(v), x = _v1[0], a1 = _v1.slice(1);
    var _v2 = _to_array(v), x = _v2[0], y = _v2[1], a2 = _v2.slice(2);
    var _v3 = _to_array(v), x = _v3[0], y = _v3[1], z = _v3[2], a3 = _v3.slice(3);
    var ref;
    ref = _to_array(v), a0 = ref.slice(0), ref;
    var ref1;
    ref1 = _to_array(v), x = ref1[0], a1 = ref1.slice(1), ref1;
    var ref2;
    ref2 = _to_array(v), x = ref2[0], y = ref2[1], a2 = ref2.slice(2), ref2;
    var ref3;
    ref3 = _to_array(v), x = ref3[0], y = ref3[1], z = ref3[2], a3 = ref3.slice(3), ref3;
}
