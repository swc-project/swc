import * as swcHelpers from "@swc/helpers";
function concat(t2, u2) {
    return swcHelpers.toConsumableArray(t2).concat(swcHelpers.toConsumableArray(u2));
}
function curry(f) {
    for(var _len1 = arguments.length, _$a = new Array(_len1 > 1 ? _len1 - 1 : 0), _key1 = 1; _key1 < _len1; _key1++)_$a[_key1 - 1] = arguments[_key1];
    return function() {
        for(var _len = arguments.length, b = new Array(_len), _key = 0; _key < _len; _key++)b[_key] = arguments[_key];
        return f.apply(void 0, swcHelpers.toConsumableArray(_$a).concat(swcHelpers.toConsumableArray(b)));
    };
}
t = [
    "hello"
], u = [
    10,
    !0
], [
    1
].concat(swcHelpers.toConsumableArray(t), [
    2
], swcHelpers.toConsumableArray(u), [
    3
]), concat([], []), concat([
    "hello"
], [
    42
]), concat([
    1,
    2,
    3
], sa), concat(sa, [
    1,
    2,
    3
]), t1 = [
    1,
    2,
    3
], u1 = [
    4,
    5,
    6
], swcHelpers.toConsumableArray(t1).concat(swcHelpers.toConsumableArray(u1)), ft1([
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
]), fm1([
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
var t, u, t1, u1, fn1 = function(a, b, c, d) {
    return 0;
};
curry(fn1), curry(fn1, 1), curry(fn1, 1, "abc"), curry(fn1, 1, "abc", !0), curry(fn1, 1, "abc", !0, [
    "x",
    "y"
]);
var fn2 = function(x, b) {
    for(var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++)args[_key - 2] = arguments[_key];
    return 0;
};
curry(fn2), curry(fn2, 1), curry(fn2, 1, !0), curry(fn2, 1, !0, "abc", "def");
var fn3 = function() {
    for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++)args[_key] = arguments[_key];
    return 0;
};
function curry2(f, t3, u3) {
    return f.apply(void 0, swcHelpers.toConsumableArray(t3).concat(swcHelpers.toConsumableArray(u3)));
}
function callApi(method) {
    return function() {
        for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++)args[_key] = arguments[_key];
        return method.apply(void 0, swcHelpers.toConsumableArray(args).concat([
            {}
        ]));
    };
}
curry(fn3), curry(fn3, "abc", "def"), curry.apply(void 0, [
    fn3
].concat(swcHelpers.toConsumableArray(sa))), curry2(fn10, [
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
]), call("hello", 32, function(a, b) {
    return 42;
}), call.apply(void 0, swcHelpers.toConsumableArray(sa).concat([
    function() {
        for(var _len = arguments.length, x = new Array(_len), _key = 0; _key < _len; _key++)x[_key] = arguments[_key];
        return 42;
    }
])), a.bind("", 1), callApi(getUser), callApi(getOrgUser);
