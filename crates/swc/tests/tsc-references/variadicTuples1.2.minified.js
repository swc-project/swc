//// [variadicTuples1.ts]
import "@swc/helpers/_/_to_array";
import { _ as _to_consumable_array } from "@swc/helpers/_/_to_consumable_array";
function concat(t, u) {
    return _to_consumable_array(t).concat(_to_consumable_array(u));
}
function curry(f) {
    for(var _len = arguments.length, _$a = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++)_$a[_key - 1] = arguments[_key];
    return function() {
        for(var _len = arguments.length, b = Array(_len), _key = 0; _key < _len; _key++)b[_key] = arguments[_key];
        return f.apply(void 0, _to_consumable_array(_$a).concat(_to_consumable_array(b)));
    };
}
u = [
    10,
    !0
], [
    1
].concat(_to_consumable_array([
    'hello'
]), [
    2
], _to_consumable_array(u), [
    3
]), concat([], []), concat([
    'hello'
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
]), u1 = [
    4,
    5,
    6
], _to_consumable_array([
    1,
    2,
    3
]).concat(_to_consumable_array(u1)), ft1([
    'hello',
    42
]), ft2([
    'hello',
    42
]), ft3([
    'hello',
    42
]), ft4([
    'hello',
    42
]), fm1([
    [
        'abc'
    ],
    [
        42
    ],
    [
        !0
    ],
    [
        'def'
    ]
]);
var u, u1, fn1 = function(a1, b, c, d) {
    return 0;
};
curry(fn1), curry(fn1, 1), curry(fn1, 1, 'abc'), curry(fn1, 1, 'abc', !0), curry(fn1, 1, 'abc', !0, [
    'x',
    'y'
]);
var fn2 = function(x, b) {
    for(var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++)args[_key - 2] = arguments[_key];
    return 0;
};
curry(fn2), curry(fn2, 1), curry(fn2, 1, !0), curry(fn2, 1, !0, 'abc', 'def');
var fn3 = function() {
    for(var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++)args[_key] = arguments[_key];
    return 0;
};
function curry2(f, t, u) {
    return f.apply(void 0, _to_consumable_array(t).concat(_to_consumable_array(u)));
}
function callApi(method) {
    return function() {
        for(var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++)args[_key] = arguments[_key];
        return method.apply(void 0, _to_consumable_array(args).concat([
            {}
        ]));
    };
}
curry(fn3), curry(fn3, 'abc', 'def'), curry.apply(void 0, [
    fn3
].concat(_to_consumable_array(sa))), curry2(fn10, [
    'hello',
    42
], [
    !0
]), curry2(fn10, [
    'hello'
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
    'a',
    'b'
], [
    'c',
    'd'
]), ft([
    'a',
    'b'
], [
    'c',
    'd',
    42
]), call('hello', 32, function(a1, b) {
    return 42;
}), call.apply(void 0, _to_consumable_array(sa).concat([
    function() {
        for(var _len = arguments.length, x = Array(_len), _key = 0; _key < _len; _key++)x[_key] = arguments[_key];
        return 42;
    }
])), a.bind("", 1), callApi(getUser), callApi(getOrgUser);
