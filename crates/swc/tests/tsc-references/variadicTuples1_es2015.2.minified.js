function concat(t, u) {
    return [
        ...t,
        ...u
    ];
}
function curry(f, ...a) {
    return (...b)=>f(...a, ...b);
}
concat([], []), concat([
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
]), ft1([
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
const fn1 = (a, b, c, d)=>0;
curry(fn1), curry(fn1, 1), curry(fn1, 1, 'abc'), curry(fn1, 1, 'abc', !0), curry(fn1, 1, 'abc', !0, [
    'x',
    'y'
]);
const fn2 = (x, b, ...args)=>0;
curry(fn2), curry(fn2, 1), curry(fn2, 1, !0), curry(fn2, 1, !0, 'abc', 'def');
const fn3 = (...args)=>0;
function curry2(f, t, u) {
    return f(...t, ...u);
}
function callApi(method) {
    return (...args)=>method(...args, {});
}
curry(fn3), curry(fn3, 'abc', 'def'), curry(fn3, ...sa), curry2(fn10, [
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
]), call('hello', 32, (a, b)=>42), call(...sa, (...x)=>42), a.bind("", 1), callApi(getUser), callApi(getOrgUser);
