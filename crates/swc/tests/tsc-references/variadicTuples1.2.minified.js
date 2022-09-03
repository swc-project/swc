//// [variadicTuples1.ts]
import _to_array from "@swc/helpers/src/_to_array.mjs";
import _to_consumable_array from "@swc/helpers/src/_to_consumable_array.mjs";
function tup2(t, u) {
    return [
        1
    ].concat(_to_consumable_array(t), [
        2
    ], _to_consumable_array(u), [
        3
    ]);
}
var t2 = tup2([
    "hello"
], [
    10,
    !0
]);
function concat(t, u) {
    return _to_consumable_array(t).concat(_to_consumable_array(u));
}
var tc1 = concat([], []), tc2 = concat([
    "hello"
], [
    42
]), tc3 = concat([
    1,
    2,
    3
], sa), tc4 = concat(sa, [
    1,
    2,
    3
]);
function concat2(t, u) {
    return _to_consumable_array(t).concat(_to_consumable_array(u));
}
var tc5 = concat2([
    1,
    2,
    3
], [
    4,
    5,
    6
]);
function foo2(t1, t2, a1) {
    foo1(1, "abc", !0, 42, 43, 44), foo1.apply(void 0, _to_consumable_array(t1).concat([
        !0,
        42,
        43,
        44
    ])), foo1.apply(void 0, _to_consumable_array(t1).concat(_to_consumable_array(t2), [
        42,
        43,
        44
    ])), foo1.apply(void 0, _to_consumable_array(t1).concat(_to_consumable_array(t2), _to_consumable_array(a1))), foo1.apply(void 0, _to_consumable_array(t1)), foo1.apply(void 0, _to_consumable_array(t1).concat([
        45
    ]));
}
function foo4(u) {
    foo3(1, 2), foo3(1, "hello", !0, 2), foo3.apply(void 0, [
        1
    ].concat(_to_consumable_array(u), [
        "hi",
        2
    ])), foo3(1);
}
function f0(t, n) {
    t[0], t[1], t[2], t[n];
}
function f1(t, n) {
    t[0], t[1], t[2], t[n];
}
function f2(t) {
    _to_array(t).slice(0);
    var _t = _to_array(t);
    _t[0], _t.slice(1);
    var _t1 = _to_array(t);
    _t1[0], _t1[1], _t1.slice(2);
}
function f3(t) {
    _to_array(t).slice(0);
    var _t = _to_array(t);
    _t[0], _t.slice(1);
    var _t1 = _to_array(t);
    _t1[0], _t1[1], _t1.slice(2);
}
ft1([
    "hello",
    42
]), ft2([
    "hello",
    42
]), ft3([
    "hello",
    42
]), ft4([
    "hello",
    42
]);
var tm1 = fm1([
    [
        "abc"
    ],
    [
        42
    ],
    [
        !0
    ],
    [
        "def"
    ]
]);
function gx1(u, v) {
    fx1("abc"), fx1.apply(void 0, [
        "abc"
    ].concat(_to_consumable_array(u))), fx1.apply(void 0, [
        "abc"
    ].concat(_to_consumable_array(v))), fx1.apply(void 0, [
        "abc"
    ].concat(_to_consumable_array(u))), fx1.apply(void 0, [
        "abc"
    ].concat(_to_consumable_array(v)));
}
function gx2(u, v) {
    fx2("abc"), fx2.apply(void 0, [
        "abc"
    ].concat(_to_consumable_array(u))), fx2.apply(void 0, [
        "abc"
    ].concat(_to_consumable_array(v))), fx2.apply(void 0, [
        "abc"
    ].concat(_to_consumable_array(u))), fx2.apply(void 0, [
        "abc"
    ].concat(_to_consumable_array(v)));
}
function f10(x, y, z) {
    x = y, y = x = z, y = z, z = x, z = y;
}
function f11(t, m, r) {
    t = m, m = t = r, m = r, r = t, r = m;
}
function f12(t, m, r) {
    t = m, m = t = r, m = r, r = t, r = m;
}
function f13(t0, t1, t2) {
    t0 = t1, t1 = t0 = t2, t1 = t2, t2 = t0, t2 = t1;
}
function f14(t0, t1, t2) {
    t0 = t1, t1 = t0 = t2, t1 = t2, t2 = t0, t2 = t1;
}
function f15(k0, k1, k2, k3) {}
function curry(f) {
    for(var _len = arguments.length, _$a = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++)_$a[_key - 1] = arguments[_key];
    return function() {
        for(var _len = arguments.length, b = Array(_len), _key = 0; _key < _len; _key++)b[_key] = arguments[_key];
        return f.apply(void 0, _to_consumable_array(_$a).concat(_to_consumable_array(b)));
    };
}
var fn1 = function(a1, b, c, d) {
    return 0;
}, c0 = curry(fn1), c1 = curry(fn1, 1), c2 = curry(fn1, 1, "abc"), c3 = curry(fn1, 1, "abc", !0), c4 = curry(fn1, 1, "abc", !0, [
    "x",
    "y"
]), fn2 = function(x, b) {
    for(var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++)args[_key - 2] = arguments[_key];
    return 0;
}, c10 = curry(fn2), c11 = curry(fn2, 1), c12 = curry(fn2, 1, !0), c13 = curry(fn2, 1, !0, "abc", "def"), fn3 = function() {
    for(var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++)args[_key] = arguments[_key];
    return 0;
}, c20 = curry(fn3), c21 = curry(fn3, "abc", "def"), c22 = curry.apply(void 0, [
    fn3
].concat(_to_consumable_array(sa)));
function curry2(f, t, u) {
    return f.apply(void 0, _to_consumable_array(t).concat(_to_consumable_array(u)));
}
function f21(args) {
    f20(args), f20([
        "foo",
        "bar"
    ]), f20([
        "foo",
        42
    ]);
}
function f23(args) {
    f22(args), f22([
        "foo",
        "bar"
    ]), f22([
        "foo",
        42
    ]);
}
curry2(fn10, [
    "hello",
    42
], [
    !0
]), curry2(fn10, [
    "hello"
], [
    42,
    !0
]), ft([
    1,
    2,
    3
], [
    1,
    2,
    3
]), ft([
    1,
    2
], [
    1,
    2,
    3
]), ft([
    "a",
    "b"
], [
    "c",
    "d"
]), ft([
    "a",
    "b"
], [
    "c",
    "d",
    42
]), call("hello", 32, function(a1, b) {
    return 42;
}), call.apply(void 0, _to_consumable_array(sa).concat([
    function() {
        for(var _len = arguments.length, x = Array(_len), _key = 0; _key < _len; _key++)x[_key] = arguments[_key];
        return 42;
    }
]));
var b = a.bind("", 1);
function callApi(method) {
    return function() {
        for(var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++)args[_key] = arguments[_key];
        return method.apply(void 0, _to_consumable_array(args).concat([
            {}
        ]));
    };
}
callApi(getUser), callApi(getOrgUser);
var data = [
    !1,
    !1
];
