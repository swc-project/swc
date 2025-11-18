//// [variadicTuples1.ts]
// Variadics in tuple types
import { _ as _to_array } from "@swc/helpers/_/_to_array";
import { _ as _to_consumable_array } from "@swc/helpers/_/_to_consumable_array";
// Variadics in array literals
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
    'hello'
], [
    10,
    true
]);
function concat(t, u) {
    return _to_consumable_array(t).concat(_to_consumable_array(u));
}
var tc1 = concat([], []);
var tc2 = concat([
    'hello'
], [
    42
]);
var tc3 = concat([
    1,
    2,
    3
], sa);
var tc4 = concat(sa, [
    1,
    2,
    3
]); // Ideally would be [...string[], number, number, number]
function concat2(t, u) {
    return _to_consumable_array(t).concat(_to_consumable_array(u)); // (T[number] | U[number])[]
}
var tc5 = concat2([
    1,
    2,
    3
], [
    4,
    5,
    6
]); // (1 | 2 | 3 | 4 | 5 | 6)[]
function foo2(t1, t2, a1) {
    foo1(1, 'abc', true, 42, 43, 44);
    foo1.apply(void 0, _to_consumable_array(t1).concat([
        true,
        42,
        43,
        44
    ]));
    foo1.apply(void 0, _to_consumable_array(t1).concat(_to_consumable_array(t2), [
        42,
        43,
        44
    ]));
    foo1.apply(void 0, _to_consumable_array(t1).concat(_to_consumable_array(t2), _to_consumable_array(a1)));
    foo1.apply(void 0, _to_consumable_array(t1)); // Error
    foo1.apply(void 0, _to_consumable_array(t1).concat([
        45
    ])); // Error
}
function foo4(u) {
    foo3(1, 2);
    foo3(1, 'hello', true, 2);
    foo3.apply(void 0, [
        1
    ].concat(_to_consumable_array(u), [
        'hi',
        2
    ]));
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
    var _$a = t[0]; // string
    var b = t[1]; // [string, ...T][1]
    var c = t[2]; // [string, ...T][2]
    var d = t[n]; // [string, ...T][number]
}
function f1(t, n) {
    var _$a = t[0]; // string
    var b = t[1]; // number | T[number]
    var c = t[2]; // [string, ...T, number][2]
    var d = t[n]; // [string, ...T, number][number]
}
// Destructuring variadic tuple types
function f2(t) {
    var _t = _to_array(t), ax = _t.slice(0); // [string, ...T]
    var _t1 = _to_array(t), b1 = _t1[0], bx = _t1.slice(1); // string, [...T]
    var _t2 = _to_array(t), c1 = _t2[0], c2 = _t2[1], cx = _t2.slice(2); // string, [string, ...T][1], T[number][]
}
function f3(t) {
    var _t = _to_array(t), ax = _t.slice(0); // [string, ...T, number]
    var _t1 = _to_array(t), b1 = _t1[0], bx = _t1.slice(1); // string, [...T, number]
    var _t2 = _to_array(t), c1 = _t2[0], c2 = _t2[1], cx = _t2.slice(2); // string, number | T[number], (number | T[number])[]
}
var tm1 = fm1([
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
    fx1.apply(void 0, [
        'abc'
    ].concat(_to_consumable_array(u))); // U
    fx1.apply(void 0, [
        'abc'
    ].concat(_to_consumable_array(v))); // [...V]
    fx1.apply(void 0, [
        'abc'
    ].concat(_to_consumable_array(u))); // U
    fx1.apply(void 0, [
        'abc'
    ].concat(_to_consumable_array(v))); // Error
}
function gx2(u, v) {
    fx2('abc'); // []
    fx2.apply(void 0, [
        'abc'
    ].concat(_to_consumable_array(u))); // U
    fx2.apply(void 0, [
        'abc'
    ].concat(_to_consumable_array(v))); // [...V]
    fx2.apply(void 0, [
        'abc'
    ].concat(_to_consumable_array(u))); // U
    fx2.apply(void 0, [
        'abc'
    ].concat(_to_consumable_array(v))); // V
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
function f13(t0, t1, t2) {
    t0 = t1;
    t0 = t2;
    t1 = t0;
    t1 = t2;
    t2 = t0; // Error
    t2 = t1; // Error
}
function f14(t0, t1, t2) {
    t0 = t1;
    t0 = t2;
    t1 = t0; // Error
    t1 = t2;
    t2 = t0; // Error
    t2 = t1; // Error
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
// Constraints of variadic tuple types
function ft16(x, y) {
    x = y;
}
function ft17(x, y) {
    x = y;
}
function ft18(x, y) {
    x = y;
}
// Inference to [...T, ...U] with implied arity for T
function curry(f) {
    for(var _len = arguments.length, _$a = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++){
        _$a[_key - 1] = arguments[_key];
    }
    return function() {
        for(var _len = arguments.length, b = new Array(_len), _key = 0; _key < _len; _key++){
            b[_key] = arguments[_key];
        }
        return f.apply(void 0, _to_consumable_array(_$a).concat(_to_consumable_array(b)));
    };
}
var fn1 = function(a1, b, c, d) {
    return 0;
};
var c0 = curry(fn1); // (a: number, b: string, c: boolean, d: string[]) => number
var c1 = curry(fn1, 1); // (b: string, c: boolean, d: string[]) => number
var c2 = curry(fn1, 1, 'abc'); // (c: boolean, d: string[]) => number
var c3 = curry(fn1, 1, 'abc', true); // (d: string[]) => number
var c4 = curry(fn1, 1, 'abc', true, [
    'x',
    'y'
]); // () => number
var fn2 = function(x, b) {
    for(var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++){
        args[_key - 2] = arguments[_key];
    }
    return 0;
};
var c10 = curry(fn2); // (x: number, b: boolean, ...args: string[]) => number
var c11 = curry(fn2, 1); // (b: boolean, ...args: string[]) => number
var c12 = curry(fn2, 1, true); // (...args: string[]) => number
var c13 = curry(fn2, 1, true, 'abc', 'def'); // (...args: string[]) => number
var fn3 = function() {
    for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++){
        args[_key] = arguments[_key];
    }
    return 0;
};
var c20 = curry(fn3); // (...args: string[]) => number
var c21 = curry(fn3, 'abc', 'def'); // (...args: string[]) => number
var c22 = curry.apply(void 0, [
    fn3
].concat(_to_consumable_array(sa))); // (...args: string[]) => number
// No inference to [...T, ...U] when there is no implied arity
function curry2(f, t, u) {
    return f.apply(void 0, _to_consumable_array(t).concat(_to_consumable_array(u)));
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
call('hello', 32, function(a1, b) {
    return 42;
});
call.apply(void 0, _to_consumable_array(sa).concat([
    function() {
        for(var _len = arguments.length, x = new Array(_len), _key = 0; _key < _len; _key++){
            x[_key] = arguments[_key];
        }
        return 42;
    }
]));
function f21(args) {
    var v1 = f20(args); // U
    var v2 = f20([
        "foo",
        "bar"
    ]); // [string]
    var v3 = f20([
        "foo",
        42
    ]); // [string]
}
function f23(args) {
    var v1 = f22(args); // U
    var v2 = f22([
        "foo",
        "bar"
    ]); // [string, string]
    var v3 = f22([
        "foo",
        42
    ]); // [string]
}
var b = a.bind("", 1); // Desc<[boolean], object>
function callApi(method) {
    return function() {
        for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++){
            args[_key] = arguments[_key];
        }
        return method.apply(void 0, _to_consumable_array(args).concat([
            {}
        ]));
    };
}
callApi(getUser);
callApi(getOrgUser);
var data = [
    false,
    false
]; // Error
