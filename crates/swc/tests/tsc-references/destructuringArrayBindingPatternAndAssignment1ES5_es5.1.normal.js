import _sliced_to_array from "@swc/helpers/src/_sliced_to_array.mjs";
import _to_array from "@swc/helpers/src/_to_array.mjs";
import _to_consumable_array from "@swc/helpers/src/_to_consumable_array.mjs";
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
var ref = _sliced_to_array(foo(), 2), b6 = ref[0], b7 = ref[1];
var ref1 = _to_array(foo()), b8 = ref1.slice(0);
//      S is not a tuple- like type and the numeric index signature type of S is assignable to the target given in E.
var temp = [
    1,
    2,
    3
];
var ref2 = _sliced_to_array(_to_consumable_array(temp), 2), c0 = ref2[0], c1 = ref2[1];
var ref3 = [], c2 = ref3[0];
var ref4 = [], c3 = ref4[0], ref5 = [], c4 = ref5[0];
var c5 = 1, c6 = true;
var ref6 = [
    1,
    2,
    3
], c7 = ref6[1];
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
