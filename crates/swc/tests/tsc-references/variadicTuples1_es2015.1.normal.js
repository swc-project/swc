// Variadics in array literals
function tup2(t, u) {
    return [
        1,
        ...t,
        2,
        ...u,
        3
    ];
}
const t2 = tup2([
    'hello'
], [
    10,
    true
]);
function concat(t, u) {
    return [
        ...t,
        ...u
    ];
}
const tc1 = concat([], []);
const tc2 = concat([
    'hello'
], [
    42
]);
const tc3 = concat([
    1,
    2,
    3
], sa);
const tc4 = concat(sa, [
    1,
    2,
    3
]); // Ideally would be [...string[], number, number, number]
function concat2(t, u) {
    return [
        ...t,
        ...u
    ]; // (T[number] | U[number])[]
}
const tc5 = concat2([
    1,
    2,
    3
], [
    4,
    5,
    6
]); // (1 | 2 | 3 | 4 | 5 | 6)[]
function foo2(t1, t21, a1) {
    foo1(1, 'abc', true, 42, 43, 44);
    foo1(...t1, true, 42, 43, 44);
    foo1(...t1, ...t21, 42, 43, 44);
    foo1(...t1, ...t21, ...a1);
    foo1(...t1); // Error
    foo1(...t1, 45); // Error
}
function foo4(u) {
    foo3(1, 2);
    foo3(1, 'hello', true, 2);
    foo3(1, ...u, 'hi', 2);
    foo3(1);
}
ft1([
    'hello',
    42
]); // (string | number)[]
ft2([
    'hello',
    42
]); // readonly (string | number)[]
ft3([
    'hello',
    42
]); // [string, number]
ft4([
    'hello',
    42
]); // readonly [string, number]
// Indexing variadic tuple types
function f0(t, n) {
    const a = t[0]; // string
    const b = t[1]; // [string, ...T][1]
    const c = t[2]; // [string, ...T][2]
    const d = t[n]; // [string, ...T][number]
}
function f1(t, n) {
    const a = t[0]; // string
    const b = t[1]; // [string, ...T, number][1]
    const c = t[2]; // [string, ...T, number][2]
    const d = t[n]; // [string, ...T, number][number]
}
// Destructuring variadic tuple types
function f2(t) {
    let [...ax] = t; // [string, ...T]
    let [b1, ...bx] = t; // string, [...T]
    let [c1, c2, ...cx] = t; // string, [string, ...T][1], T[number][]
}
function f3(t) {
    let [...ax] = t; // [string, ...T, number]
    let [b1, ...bx] = t; // string, [...T, number]
    let [c1, c2, ...cx] = t; // string, [string, ...T, number][1], (number | T[number])[]
}
let tm1 = fm1([
    [
        'abc'
    ],
    [
        42
    ],
    [
        true
    ],
    [
        'def'
    ]
]); // [boolean, string]
function gx1(u, v) {
    fx1('abc'); // []
    fx1('abc', ...u); // U
    fx1('abc', ...v); // [...V]
    fx1('abc', ...u); // U
    fx1('abc', ...v); // Error
}
function gx2(u, v) {
    fx2('abc'); // []
    fx2('abc', ...u); // U
    fx2('abc', ...v); // [...V]
    fx2('abc', ...u); // U
    fx2('abc', ...v); // V
}
// Relations involving variadic tuple types
function f10(x, y, z) {
    x = y;
    x = z;
    y = x; // Error
    y = z;
    z = x; // Error
    z = y; // Error
}
// For a generic type T, [...T] is assignable to T, T is assignable to readonly [...T], and T is assignable
// to [...T] when T is constrained to a mutable array or tuple type.
function f11(t, m, r) {
    t = m;
    t = r; // Error
    m = t;
    m = r; // Error
    r = t;
    r = m;
}
function f12(t, m, r) {
    t = m;
    t = r; // Error
    m = t; // Error
    m = r; // Error
    r = t;
    r = m;
}
function f13(t0, t1, t22) {
    t0 = t1;
    t0 = t22;
    t1 = t0;
    t1 = t22;
    t22 = t0; // Error
    t22 = t1; // Error
}
function f14(t0, t1, t23) {
    t0 = t1;
    t0 = t23;
    t1 = t0; // Error
    t1 = t23;
    t23 = t0; // Error
    t23 = t1; // Error
}
function f15(k0, k1, k2, k3) {
    k0 = 'length';
    k1 = 'length';
    k2 = 'length';
    k0 = 'slice';
    k1 = 'slice';
    k2 = 'slice';
    k3 = '0';
    k3 = '1';
    k3 = '2'; // Error
}
// Inference to [...T, ...U] with implied arity for T
function curry(f, ...a) {
    return (...b2)=>f(...a, ...b2);
}
const fn1 = (a, b, c, d)=>0;
const c0 = curry(fn1); // (a: number, b: string, c: boolean, d: string[]) => number
const c1 = curry(fn1, 1); // (b: string, c: boolean, d: string[]) => number
const c2 = curry(fn1, 1, 'abc'); // (c: boolean, d: string[]) => number
const c3 = curry(fn1, 1, 'abc', true); // (d: string[]) => number
const c4 = curry(fn1, 1, 'abc', true, [
    'x',
    'y'
]); // () => number
const fn2 = (x, b, ...args)=>0;
const c10 = curry(fn2); // (x: number, b: boolean, ...args: string[]) => number
const c11 = curry(fn2, 1); // (b: boolean, ...args: string[]) => number
const c12 = curry(fn2, 1, true); // (...args: string[]) => number
const c13 = curry(fn2, 1, true, 'abc', 'def'); // (...args: string[]) => number
const fn3 = (...args)=>0;
const c20 = curry(fn3); // (...args: string[]) => number
const c21 = curry(fn3, 'abc', 'def'); // (...args: string[]) => number
const c22 = curry(fn3, ...sa); // (...args: string[]) => number
// No inference to [...T, ...U] when there is no implied arity
function curry2(f, t, u) {
    return f(...t, ...u);
}
curry2(fn10, [
    'hello',
    42
], [
    true
]);
curry2(fn10, [
    'hello'
], [
    42,
    true
]);
ft([
    1,
    2,
    3
], [
    1,
    2,
    3
]);
ft([
    1,
    2
], [
    1,
    2,
    3
]);
ft([
    'a',
    'b'
], [
    'c',
    'd'
]);
ft([
    'a',
    'b'
], [
    'c',
    'd',
    42
]);
call('hello', 32, (a, b)=>42);
call(...sa, (...x)=>42);
function f21(args) {
    let v1 = f20(args); // U
    let v2 = f20([
        "foo",
        "bar"
    ]); // [string]
    let v3 = f20([
        "foo",
        42
    ]); // [string]
}
function f23(args) {
    let v1 = f22(args); // U
    let v2 = f22([
        "foo",
        "bar"
    ]); // [string, string]
    let v3 = f22([
        "foo",
        42
    ]); // [string]
}
const b = a.bind("", 1); // Desc<[boolean], object>
function callApi(method) {
    return (...args)=>method(...args, {});
}
callApi(getUser);
callApi(getOrgUser);
const data = [
    false,
    false
]; // Error
