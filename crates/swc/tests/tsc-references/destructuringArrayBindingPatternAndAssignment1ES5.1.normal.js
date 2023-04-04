//// [destructuringArrayBindingPatternAndAssignment1ES5.ts]
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
import { _ as _sliced_to_array } from "@swc/helpers/_/_sliced_to_array";
import { _ as _to_array } from "@swc/helpers/_/_to_array";
import { _ as _to_consumable_array } from "@swc/helpers/_/_to_consumable_array";
var _undefined = _sliced_to_array(undefined, 2), a0 = _undefined[0], a1 = _undefined[1];
var _undefined1 = _sliced_to_array(undefined, 2), tmp = _undefined1[0], a2 = tmp === void 0 ? false : tmp, tmp1 = _undefined1[1], a3 = tmp1 === void 0 ? 1 : tmp1;
// V is an array assignment pattern, S is the type Any or an array-like type (section 3.3.2), and, for each assignment element E in V,
//      S is a tuple- like type (section 3.3.3) with a property named N of a type that is assignable to the target given in E,
//        where N is the numeric index of E in the array assignment pattern, or
var b0 = 2, b1 = 3, b2 = 4;
var b3 = 1, b4 = 2, b5 = "string";
function foo() {
    return [
        1,
        2,
        3
    ];
}
var _foo = _sliced_to_array(foo(), 2), b6 = _foo[0], b7 = _foo[1];
var _foo1 = _to_array(foo()), b8 = _foo1.slice(0);
//      S is not a tuple- like type and the numeric index signature type of S is assignable to the target given in E.
var temp = [
    1,
    2,
    3
];
var _$_to_consumable_array = _sliced_to_array(_to_consumable_array(temp), 2), c0 = _$_to_consumable_array[0], c1 = _$_to_consumable_array[1];
var _ref = [], c2 = _ref[0];
var _ref1 = [], c3 = _ref1[0], _ref2 = [], c4 = _ref2[0];
var c5 = 1, c6 = true;
var _ref3 = [
    1,
    2,
    3
], c7 = _ref3[1];
var c8 = 4;
var c9 = 4;
var c10 = [
    4,
    "hello"
];
var c11 = 1, c12 = 2, c13 = [
    "string"
];
var c14 = 1, c15 = 2, c16 = "string";
