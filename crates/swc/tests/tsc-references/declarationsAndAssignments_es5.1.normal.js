function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
    return arr2;
}
function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
}
function _iterableToArray(iter) {
    if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}
function _iterableToArrayLimit(arr, i) {
    var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];
    if (_i == null) return;
    var _arr = [];
    var _n = true;
    var _d = false;
    var _s, _e;
    try {
        for(_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true){
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
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}
function _throw(e) {
    throw e;
}
function _toArray(arr) {
    return _arrayWithHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}
function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(n);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
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
    var x = 2;
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
    var ref9 = {
        x: 5,
        y: "hello"
    }, ref9 = ref9 !== null ? ref9 : _throw(new TypeError("Cannot destructure undefined")); // Error, no x and y in target
    var x = {
        x: 5,
        y: "hello"
    }.x; // Error, no y in target
    var y = {
        x: 5,
        y: "hello"
    }.y; // Error, no x in target
    var ref5 = {
        x: 5,
        y: "hello"
    }, x = ref5.x, y = ref5.y;
    var x;
    var y;
    var ref6 = {
        x: 5,
        y: "hello"
    }, a = ref6.x; // Error, no y in target
    var ref7 = {
        x: 5,
        y: "hello"
    }, b = ref7.y; // Error, no x in target
    var ref8 = {
        x: 5,
        y: "hello"
    }, a = ref8.x, b = ref8.y;
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
    var ref10 = {
        a: 1,
        b: {
            a: "hello",
            b: {
                a: true
            }
        }
    }, x = ref10.a, _b = ref10.b, y = _b.a, _b1 = _b.b, z = _b1.a;
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
    var ref12 = [], a = ref12[0], b = ref12[1], c = ref12[2]; // Error, [] is an empty tuple
    var ref11 = [
        1
    ], d = ref11[0], e = ref11[1], f = ref11[2]; // Error, [1] is a tuple
}
function f9() {
    var ref14 = _slicedToArray({
    }, 2), a = ref14[0], b = ref14[1]; // Error, not array type
    var ref13 = _slicedToArray({
        0: 10,
        1: 20
    }, 2), c = ref13[0], d = ref13[1]; // Error, not array type
    var e = 10, f = 20;
}
function f10() {
    var ref16 = {
    }, a = ref16.a, b = ref16.b; // Error
    var ref15 = [], a = ref15.a, b = ref15.b; // Error
}
function f11() {
    var ref20 = {
        x: 10,
        y: "hello"
    }, a = ref20.x, b = ref20.y;
    var ref17 = {
        0: 10,
        1: "hello"
    }, a = ref17[0], b = ref17[1];
    var ref18 = {
        "<": 10,
        ">": "hello"
    }, a = ref18["<"], b = ref18[">"];
    var ref19 = [
        10,
        "hello"
    ], a = ref19[0], b = ref19[1];
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
    ], ref22 = _slicedToArray(tmp === void 0 ? [
        "abc",
        {
            x: 10,
            y: false
        }
    ] : tmp, 2), b = ref22[0], ref21 = ref22[1], x = ref21.x, c = ref21.y;
    var a;
    var b;
    var x;
    var c;
}
function f13() {
    var x = 1, y = "hello";
    var ref23 = [
        [
            x,
            y
        ],
        {
            x: x,
            y: y
        }
    ], a = ref23[0], b = ref23[1];
}
function f14(param) {
    var _param = _slicedToArray(param, 2), tmp = _param[0], a = tmp === void 0 ? 1 : tmp, ref25 = _slicedToArray(_param[1], 2), tmp3 = ref25[0], b = tmp3 === void 0 ? "hello" : tmp3, ref24 = ref25[1], x = ref24.x, tmp4 = ref24.y, c = tmp4 === void 0 ? false : tmp4;
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
})(M || (M = {
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
    var ref26 = f15(), a = ref26.a, b = ref26.b, c = ref26.c;
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
var ref, ref1;
function f18() {
    var a;
    var b;
    var aa;
    var ref30;
    ref30 = {
        a: a,
        b: b
    }, a = ref30.a, b = ref30.b, ref30;
    var ref27;
    ref27 = {
        b: b,
        a: a
    }, a = ref27.a, b = ref27.b, ref27;
    var ref28;
    ref28 = [
        a,
        b
    ], aa[0] = ref28[0], b = ref28[1], ref28;
    var ref29;
    ref29 = [
        b,
        a
    ], a = ref29[0], b = ref29[1], ref29; // Error
    ref = 1, a = ref, ref1 = "abc", b = ref1;
}
var ref2;
function f19() {
    var a, b;
    a = 1, b = 2;
    var ref33;
    ref33 = [
        b,
        a
    ], a = ref33[0], b = ref33[1], ref33;
    var ref31;
    ref31 = {
        b: b,
        a: a
    }, a = ref31.a, b = ref31.b, ref31;
    ref2 = [
        1,
        2
    ], [a, b] = ref2;
    var ref32;
    var x = (ref32 = [
        1,
        2
    ], a = ref32[0], b = ref32[1], ref32);
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
    var ref37;
    ref37 = _toArray(v), a3 = ref37.slice(0), ref37;
    var ref34;
    ref34 = _toArray(v), x = ref34[0], a2 = ref34.slice(1), ref34;
    var ref35;
    ref35 = _toArray(v), x = ref35[0], y = ref35[1], a1 = ref35.slice(2), ref35;
    var ref36;
    ref36 = _toArray(v), x = ref36[0], y = ref36[1], z = ref36[2], a0 = ref36.slice(3), ref36;
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
    var ref41;
    ref41 = _toArray(v), a0 = ref41.slice(0), ref41;
    var ref38;
    ref38 = _toArray(v), x = ref38[0], a1 = ref38.slice(1), ref38;
    var ref39;
    ref39 = _toArray(v), x = ref39[0], y = ref39[1], a2 = ref39.slice(2), ref39;
    var ref40;
    ref40 = _toArray(v), x = ref40[0], y = ref40[1], z = ref40[2], a3 = ref40.slice(3), ref40;
}
