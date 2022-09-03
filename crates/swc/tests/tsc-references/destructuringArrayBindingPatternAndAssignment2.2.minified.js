//// [destructuringArrayBindingPatternAndAssignment2.ts]
import _sliced_to_array from "@swc/helpers/src/_sliced_to_array.mjs";
import _to_consumable_array from "@swc/helpers/src/_to_consumable_array.mjs";
var ref = [], ref1 = _sliced_to_array(ref[0], 1), a0 = ref1[0], ref2 = _sliced_to_array(ref[1], 1), ref3 = _sliced_to_array(ref2[0], 1), a1 = ref3[0], _undefined = _sliced_to_array(void 0, 2), ref4 = _sliced_to_array(_undefined[0], 1), a2 = ref4[0], ref5 = _sliced_to_array(_undefined[1], 1), ref6 = _sliced_to_array(ref5[0], 1), a3 = ref6[0], b0 = 1, b1 = 2, b2 = "string";
function bar() {
    return [
        1,
        2,
        3
    ];
}
var ref7 = _sliced_to_array(bar(), 3), tmp = ref7[0], b3 = void 0 === tmp ? "string" : tmp, b4 = ref7[1], b5 = ref7[2], temp = [
    1,
    2,
    3
], ref8 = _sliced_to_array(_to_consumable_array(temp), 2), c0 = ref8[0], c1 = ref8[1], ref9 = _sliced_to_array(_to_consumable_array(temp), 2), c2 = ref9[0], c3 = ref9[1];
function foo(idx) {
    return {
        2: !0
    };
}
var ref10 = _sliced_to_array(foo(1), 3), c4 = ref10[0], c5 = ref10[1], c6 = ref10[2];
