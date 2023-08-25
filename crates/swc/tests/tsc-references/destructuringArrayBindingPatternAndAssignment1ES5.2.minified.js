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
var _undefined = _sliced_to_array(void 0, 2);
_undefined[0], _undefined[1];
var _undefined1 = _sliced_to_array(void 0, 2);
_undefined1[0], _undefined1[1];
var _foo = _sliced_to_array([
    1,
    2,
    3
], 2);
_foo[0], _foo[1], _to_array([
    1,
    2,
    3
]).slice(0);
var _$_to_consumable_array = _sliced_to_array(_to_consumable_array([
    1,
    2,
    3
]), 2);
_$_to_consumable_array[0], _$_to_consumable_array[1];
