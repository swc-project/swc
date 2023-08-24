//// [destructuringArrayBindingPatternAndAssignment2.ts]
// V is an array assignment pattern, S is the type Any or an array-like type (section 3.3.2), and, for each assignment element E in V,
//      S is the type Any, or
import { _ as _sliced_to_array } from "@swc/helpers/_/_sliced_to_array";
import { _ as _to_consumable_array } from "@swc/helpers/_/_to_consumable_array";
var _ref_1 = (_sliced_to_array([] // Error
[0], 1)[0], _sliced_to_array([][1], 1));
_sliced_to_array(_ref_1[0], 1)[0];
var _undefined // Error
 = _sliced_to_array(void 0, 2), _undefined_1 = (_sliced_to_array(_undefined[0], 1)[0], _sliced_to_array(_undefined[1], 1));
_sliced_to_array(_undefined_1[0], 1)[0];
var _bar = _sliced_to_array([
    1,
    2,
    3
], 3); // Error
_bar[0], _bar[1], _bar[2];
// V is an array assignment pattern, S is the type Any or an array-like type (section 3.3.2), and, for each assignment element E in V,
//      S is not a tuple- like type and the numeric index signature type of S is assignable to the target given in E.
var temp = [
    1,
    2,
    3
], _$_to_consumable_array = _sliced_to_array(_to_consumable_array(temp), 2);
_$_to_consumable_array[0], _$_to_consumable_array[1];
var _$_to_consumable_array1 = _sliced_to_array(_to_consumable_array(temp), 2); // Error
_$_to_consumable_array1[0], _$_to_consumable_array1[1];
var _foo = _sliced_to_array({
    2: !0
}, 3); // Error
_foo[0], _foo[1], _foo[2];
