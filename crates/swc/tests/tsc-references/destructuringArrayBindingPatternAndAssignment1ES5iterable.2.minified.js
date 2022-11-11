//// [destructuringArrayBindingPatternAndAssignment1ES5iterable.ts]
import _sliced_to_array from "@swc/helpers/src/_sliced_to_array.mjs";
import _to_array from "@swc/helpers/src/_to_array.mjs";
import _to_consumable_array from "@swc/helpers/src/_to_consumable_array.mjs";
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
