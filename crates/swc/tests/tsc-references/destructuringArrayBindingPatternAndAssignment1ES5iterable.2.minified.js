//// [destructuringArrayBindingPatternAndAssignment1ES5iterable.ts]
import _sliced_to_array from "@swc/helpers/src/_sliced_to_array.mjs";
import _to_array from "@swc/helpers/src/_to_array.mjs";
import _to_consumable_array from "@swc/helpers/src/_to_consumable_array.mjs";
var _undefined = _sliced_to_array(void 0, 2), a0 = _undefined[0], a1 = _undefined[1], _undefined1 = _sliced_to_array(void 0, 2), tmp = _undefined1[0], a2 = void 0 !== tmp && tmp, tmp1 = _undefined1[1], a3 = void 0 === tmp1 ? 1 : tmp1, b0 = 2, b1 = 3, b2 = 4, b3 = 1, b4 = 2, b5 = "string";
function foo() {
    return [
        1,
        2,
        3
    ];
}
var ref = _sliced_to_array(foo(), 2), b6 = ref[0], b7 = ref[1], ref1 = _to_array(foo()), b8 = ref1.slice(0), temp = [
    1,
    2,
    3
], ref2 = _sliced_to_array(_to_consumable_array(temp), 2), c0 = ref2[0], c1 = ref2[1], ref3 = [], c2 = ref3[0], ref4 = [], c3 = ref4[0], ref5 = [], c4 = ref5[0], c5 = 1, c6 = !0, ref6 = [
    1,
    2,
    3
], c7 = ref6[1], c8 = 4, c9 = 4, c10 = [
    4,
    "hello"
], c11 = 1, c12 = 2, c13 = [
    "string"
], c14 = 1, c15 = 2, c16 = "string";
