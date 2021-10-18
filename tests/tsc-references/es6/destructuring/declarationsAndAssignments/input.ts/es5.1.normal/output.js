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
    var ref1 = [
        1,
        "hello"
    ], x = ref1[0];
    var x = 1, y = "hello";
    var ref2 = [
        1,
        "hello"
    ], x = ref2[0], y = ref2[1], z = ref2[2];
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
    var ref1 = {
        x: 5,
        y: "hello"
    }, x = ref1.x; // Error, no y in target
    var ref2 = {
        x: 5,
        y: "hello"
    }, y = ref2.y; // Error, no x in target
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
    var ref = _slicedToArray({
    }, 2), a = ref[0], b = ref[1]; // Error, not array type
    var ref1 = _slicedToArray({
        0: 10,
        1: 20
    }, 2), c = ref1[0], d = ref1[1]; // Error, not array type
    var e = 10, f = 20;
}
function f10() {
    var ref = {
    }, a = ref.a, b = ref.b; // Error
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
    ], ref = _slicedToArray(tmp === void 0 ? [
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
    var _param = _slicedToArray(param, 2), tmp = _param[0], a = tmp === void 0 ? 1 : tmp, ref = _slicedToArray(_param[1], 2), tmp1 = ref[0], b = tmp1 === void 0 ? "hello" : tmp1, ref1 = ref[1], x = ref1.x, tmp2 = ref1.y, c = tmp2 === void 0 ? false : tmp2;
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
var ref, ref1;
function f18() {
    var a;
    var b;
    var aa;
    var ref5;
    ref5 = {
        a: a,
        b: b
    }, a = ref5.a, b = ref5.b, ref5;
    var ref2;
    ref2 = {
        b: b,
        a: a
    }, a = ref2.a, b = ref2.b, ref2;
    var ref3;
    ref3 = [
        a,
        b
    ], aa[0] = ref3[0], b = ref3[1], ref3;
    var ref4;
    ref4 = [
        b,
        a
    ], a = ref4[0], b = ref4[1], ref4; // Error
    ref = 1, a = ref, ref1 = "abc", b = ref1;
}
var ref6;
function f19() {
    var a, b;
    a = 1, b = 2;
    var ref10;
    ref10 = [
        b,
        a
    ], a = ref10[0], b = ref10[1], ref10;
    var ref7;
    ref7 = {
        b: b,
        a: a
    }, a = ref7.a, b = ref7.b, ref7;
    ref6 = [
        1,
        2
    ], [a, b] = ref6;
    var ref8;
    var x = (ref8 = [
        1,
        2
    ], a = ref8[0], b = ref8[1], ref8);
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
    var ref19;
    ref19 = v, a3 = ref19.slice(0), ref19;
    var ref7;
    ref7 = v, x = ref7[0], a2 = ref7.slice(1), ref7;
    var ref8;
    ref8 = v, x = ref8[0], y = ref8[1], a1 = ref8.slice(2), ref8;
    var ref10;
    ref10 = v, x = ref10[0], y = ref10[1], z = ref10[2], a0 = ref10.slice(3), ref10;
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
    var _v1 = _toArray(v), x = _v1[0], a1 = _v1.slice(1);
    var _v2 = _toArray(v), x = _v2[0], y = _v2[1], a2 = _v2.slice(2);
    var _v3 = _toArray(v), x = _v3[0], y = _v3[1], z = _v3[2], a3 = _v3.slice(3);
    var ref19;
    ref19 = v, a0 = ref19.slice(0), ref19;
    var ref7;
    ref7 = v, x = ref7[0], a1 = ref7.slice(1), ref7;
    var ref8;
    ref8 = v, x = ref8[0], y = ref8[1], a2 = ref8.slice(2), ref8;
    var ref10;
    ref10 = v, x = ref10[0], y = ref10[1], z = ref10[2], a3 = ref10.slice(3), ref10;
}
