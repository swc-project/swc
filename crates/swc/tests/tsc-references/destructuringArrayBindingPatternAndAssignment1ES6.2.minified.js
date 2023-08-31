//// [destructuringArrayBindingPatternAndAssignment1ES6.ts]
/* AssignmentPattern:
 *      ObjectAssignmentPattern
 *      ArrayAssignmentPattern
 * ArrayAssignmentPattern:
 *      [Elision<opt>   AssignmentRestElementopt   ]
 *      [AssignmentElementList]
 *      [AssignmentElementList, Elision<opt>   AssignmentRestElementopt   ]
 * AssignmentElementList:
 *      Elision<opt>   AssignmentElement
 *      AssignmentElementList, Elisionopt   AssignmentElement
 * AssignmentElement:
 *      LeftHandSideExpression   Initialiseropt
 *      AssignmentPattern   Initialiseropt
 * AssignmentRestElement:
 *      ...   LeftHandSideExpression
 */ // In a destructuring assignment expression, the type of the expression on the right must be assignable to the assignment target on the left.
// An expression of type S is considered assignable to an assignment target V if one of the following is true
// V is an array assignment pattern, S is the type Any or an array-like type (section 3.3.2), and, for each assignment element E in V,
//      S is the type Any, or
var [a0, a1] = void 0, [a2 = !1, a3 = 1] = void 0, [b0, b1, b2] = [
    2,
    3,
    4
], [b3, b4, b5] = [
    1,
    2,
    "string"
], [b6, b7] = [
    1,
    2,
    3
], [...b8] = [
    1,
    2,
    3
], [c0, c1] = [
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
