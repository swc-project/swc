//// [destructuringArrayBindingPatternAndAssignment1ES6.ts]
var [a0, a1] = void 0, [a2 = !1, a3 = 1] = void 0, [b0, b1, b2] = [
    2,
    3,
    4
], [b3, b4, b5] = [
    1,
    2,
    "string"
];
function foo() {
    return [
        1,
        2,
        3
    ];
}
var [b6, b7] = foo(), [...b8] = foo(), [c0, c1] = [
    1,
    2,
    3
], [c2] = [], [[[c3]], [[[[c4]]]]] = [
    [
        []
    ],
    [
        [
            [
                []
            ]
        ]
    ]
], [[c5], c6] = [
    [
        1
    ],
    !0
], [, c7] = [
    1,
    2,
    3
], [, , , c8] = [
    1,
    2,
    3,
    4
], [, , , c9] = [
    1,
    2,
    3,
    4
], [, , , ...c10] = [
    1,
    2,
    3,
    4,
    "hello"
], [c11, c12, ...c13] = [
    1,
    2,
    "string"
], [c14, c15, c16] = [
    1,
    2,
    "string"
];
