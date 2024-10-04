//// [destructuringParameterDeclaration3ES6.ts]
// If the parameter is a rest parameter, the parameter type is any[]
// A type annotation for a rest parameter must denote an array type.
// RestParameter:
//     ...   Identifier   TypeAnnotation(opt)
function a1(...x) {}
function a2(...a) {}
function a3(...a) {}
function a4(...a) {}
function a5(...a) {}
function a9([a, b, [[c]]]) {}
function a10([a, b, [[c]], ...x]) {}
function a11([a, b, c, ...x]) {}
var array = [
    1,
    2,
    3
];
var array2 = [
    true,
    false,
    "hello"
];
a2([
    ...array
]);
a1(...array);
a9([
    1,
    2,
    [
        [
            "string"
        ]
    ],
    false,
    true
]); // Parameter type is [any, any, [[any]]]
a10([
    1,
    2,
    [
        [
            "string"
        ]
    ],
    false,
    true
]); // Parameter type is any[]
a10([
    1,
    2,
    3,
    false,
    true
]); // Parameter type is any[]
a10([
    1,
    2
]); // Parameter type is any[]
a11([
    1,
    2
]); // Parameter type is number[]
// Rest parameter with generic
function foo(...a) {}
foo("hello", 1, 2);
foo("hello", "world");
var E = /*#__PURE__*/ function(E) {
    E[E["a"] = 0] = "a";
    E[E["b"] = 1] = "b";
    return E;
}(E || {});
;
function foo1(...a) {}
foo1(1, 2, 3, 0);
foo1(1, 2, 3, 0, 1);
