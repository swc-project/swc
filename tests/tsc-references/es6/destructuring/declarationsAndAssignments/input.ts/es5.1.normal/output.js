function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
}
function _iterableToArray(iter) {
    if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
}
function _iterableToArrayLimit(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;
    try {
        for(var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true){
            _arr.push(_s.value);
            if (i && _arr.length === i) break;
        }
    } catch (err) {
        _d = true;
        _e = err;
    } finally{
        try {
            if (!_n && _i["return"] != null) _i["return"]();
        } finally{
            if (_d) throw _e;
        }
    }
    return _arr;
}
function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance");
}
function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();
}
function _throw(e) {
    throw e;
}
function _toArray(arr) {
    return _arrayWithHoles(arr) || _iterableToArray(arr) || _nonIterableRest();
}
function f0() {
    var ref = [
        1,
        "hello"
    ];
    var ref3 = [
        1,
        "hello"
    ], x = ref3[0];
    var x = 1, y = "hello";
    var ref4 = [
        1,
        "hello"
    ], x = ref4[0], y = ref4[1], z = ref4[2];
    var x = 0;
    var x;
    var y;
}
function f1() {
    var a = [
        1,
        "hello"
    ];
    var _a = _slicedToArray(a, 1), x = _a[0];
    var _a1 = _slicedToArray(a, 2), x = _a1[0], y = _a1[1];
    var _a2 = _slicedToArray(a, 3), x = _a2[0], y = _a2[1], z = _a2[2];
    var x;
    var y;
    var z;
}
function f2() {
    var ref = {
        x: 5,
        y: "hello"
    }, ref = ref !== null ? ref : _throw(new TypeError("Cannot destructure undefined")); // Error, no x and y in target
    var ref5 = {
        x: 5,
        y: "hello"
    }, x = ref5.x; // Error, no y in target
    var ref6 = {
        x: 5,
        y: "hello"
    }, y = ref6.y; // Error, no x in target
    var ref7 = {
        x: 5,
        y: "hello"
    }, x = ref7.x, y = ref7.y;
    var x;
    var y;
    var ref8 = {
        x: 5,
        y: "hello"
    }, a = ref8.x; // Error, no y in target
    var ref9 = {
        x: 5,
        y: "hello"
    }, b = ref9.y; // Error, no x in target
    var ref10 = {
        x: 5,
        y: "hello"
    }, a = ref10.x, b = ref10.y;
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
    var ref12 = [
        1
    ], d = ref12[0], e = ref12[1], f = ref12[2]; // Error, [1] is a tuple
}
function f9() {
    var ref = _slicedToArray({
    }, 2), a = ref[0], b = ref[1]; // Error, not array type
    var ref13 = _slicedToArray({
        0: 10,
        1: 20
    }, 2), c = ref13[0], d = ref13[1]; // Error, not array type
    var e = 10, f = 20;
}
function f10() {
    var ref = {
    }, a = ref.a, b = ref.b; // Error
    var ref14 = [], a = ref14.a, b = ref14.b; // Error
}
function f11() {
    var ref = {
        x: 10,
        y: "hello"
    }, a = ref.x, b = ref.y;
    var ref15 = {
        0: 10,
        1: "hello"
    }, a = ref15[0], b = ref15[1];
    var ref16 = {
        "<": 10,
        ">": "hello"
    }, a = ref16["<"], b = ref16[">"];
    var ref17 = [
        10,
        "hello"
    ], a = ref17[0], b = ref17[1];
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
    ], ref = _slicedToArray(tmp === void 0 ? [
        "abc",
        {
            x: 10,
            y: false
        }
    ] : tmp, 2), b = ref[0], ref18 = ref[1], x = ref18.x, c = ref18.y;
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
    var _param = _slicedToArray(param, 2), tmp = _param[0], a = tmp === void 0 ? 1 : tmp, ref = _slicedToArray(_param[1], 2), tmp3 = ref[0], b = tmp3 === void 0 ? "hello" : tmp3, ref19 = ref[1], x = ref19.x, tmp4 = ref19.y, c = tmp4 === void 0 ? false : tmp4;
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
var M1;
(function(M) {
    M.a = 1, M.b = 2;
})(M1 || (M1 = {
}));
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
f17({
});
f17({
    a: "hello"
});
f17({
    c: true
});
f17(f15());
var ref11, ref1;
function f18() {
    var a;
    var b;
    var aa;
    var ref;
    ref = {
        a: a,
        b: b
    }, a = ref.a, b = ref.b, ref;
    var ref20;
    ref20 = {
        b: b,
        a: a
    }, a = ref20.a, b = ref20.b, ref20;
    var ref21;
    ref21 = [
        a,
        b
    ], aa[0] = ref21[0], b = ref21[1], ref21;
    var ref22;
    ref22 = [
        b,
        a
    ], a = ref22[0], b = ref22[1], ref22; // Error
    ref11 = 1, a = ref11, ref1 = "abc", b = ref1;
}
var ref2;
function f19() {
    var a, b;
    a = 1, b = 2;
    var ref;
    ref = [
        b,
        a
    ], a = ref[0], b = ref[1], ref;
    var ref23;
    ref23 = {
        b: b,
        a: a
    }, a = ref23.a, b = ref23.b, ref23;
    ref2 = [
        1,
        2
    ], [a, b] = ref2;
    var ref24;
    var x = (ref24 = [
        1,
        2
    ], a = ref24[0], b = ref24[1], ref24);
}
function f20(v) {
    var x;
    var y;
    var z;
    var a0;
    var a1;
    var a2;
    var a3;
    var _v = _toArray(v), a3 = _v.slice(0);
    var _v1 = _toArray(v), x = _v1[0], a2 = _v1.slice(1);
    var _v2 = _toArray(v), x = _v2[0], y = _v2[1], a1 = _v2.slice(2);
    var _v3 = _toArray(v), x = _v3[0], y = _v3[1], z = _v3[2], a0 = _v3.slice(3);
    var ref;
    ref = v, a3 = ref.slice(0), ref;
    var ref25;
    ref25 = v, x = ref25[0], a2 = ref25.slice(1), ref25;
    var ref26;
    ref26 = v, x = ref26[0], y = ref26[1], a1 = ref26.slice(2), ref26;
    var ref27;
    ref27 = v, x = ref27[0], y = ref27[1], z = ref27[2], a0 = ref27.slice(3), ref27;
}
function f21(v) {
    var x;
    var y;
    var z;
    var a0;
    var a1;
    var a2;
    var a3;
    var _v = _toArray(v), a0 = _v.slice(0);
    var _v4 = _toArray(v), x = _v4[0], a1 = _v4.slice(1);
    var _v5 = _toArray(v), x = _v5[0], y = _v5[1], a2 = _v5.slice(2);
    var _v6 = _toArray(v), x = _v6[0], y = _v6[1], z = _v6[2], a3 = _v6.slice(3);
    var ref;
    ref = v, a0 = ref.slice(0), ref;
    var ref28;
    ref28 = v, x = ref28[0], a1 = ref28.slice(1), ref28;
    var ref29;
    ref29 = v, x = ref29[0], y = ref29[1], a2 = ref29.slice(2), ref29;
    var ref30;
    ref30 = v, x = ref30[0], y = ref30[1], z = ref30[2], a3 = ref30.slice(3), ref30;
}
