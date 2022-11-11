//// [destructuringArrayBindingPatternAndAssignment2.ts]
// V is an array assignment pattern, S is the type Any or an array-like type (section 3.3.2), and, for each assignment element E in V,
//      S is the type Any, or
import _sliced_to_array from "@swc/helpers/src/_sliced_to_array.mjs";
import _to_consumable_array from "@swc/helpers/src/_to_consumable_array.mjs";
var _ref // Error
 = [], _ref_ = _sliced_to_array(_ref[0], 1), a0 = _ref_[0], _ref_1 = _sliced_to_array(_ref[1], 1), _ref__ = _sliced_to_array(_ref_1[0], 1), a1 = _ref__[0];
var _undefined // Error
 = _sliced_to_array(undefined, 2), _undefined_ = _sliced_to_array(_undefined[0], 1), a2 = _undefined_[0], _undefined_1 = _sliced_to_array(_undefined[1], 1), _undefined__ = _sliced_to_array(_undefined_1[0], 1), a3 = _undefined__[0];
// V is an array assignment pattern, S is the type Any or an array-like type (section 3.3.2), and, for each assignment element E in V,
//      S is a tuple- like type (section 3.3.3) with a property named N of a type that is assignable to the target given in E,
//        where N is the numeric index of E in the array assignment pattern, or
var b0 = 1, b1 = 2, b2 = "string"; // Error
function bar() {
    return [
        1,
        2,
        3
    ];
}
var _bar = _sliced_to_array(bar(), 3), tmp = _bar[0], b3 = tmp === void 0 ? "string" : tmp, b4 = _bar[1], b5 = _bar[2]; // Error
// V is an array assignment pattern, S is the type Any or an array-like type (section 3.3.2), and, for each assignment element E in V,
//      S is not a tuple- like type and the numeric index signature type of S is assignable to the target given in E.
var temp = [
    1,
    2,
    3
];
var _$_to_consumable_array = _sliced_to_array(_to_consumable_array(temp), 2), c0 = _$_to_consumable_array[0], c1 = _$_to_consumable_array[1]; // Error
var _$_to_consumable_array1 = _sliced_to_array(_to_consumable_array(temp), 2), c2 = _$_to_consumable_array1[0], c3 = _$_to_consumable_array1[1]; // Error
function foo(idx) {
    return {
        2: true
    };
}
var _foo = _sliced_to_array(foo(1), 3), c4 = _foo[0], c5 = _foo[1], c6 = _foo[2]; // Error
