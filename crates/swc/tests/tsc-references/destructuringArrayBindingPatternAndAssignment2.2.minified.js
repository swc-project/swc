//// [destructuringArrayBindingPatternAndAssignment2.ts]
import _sliced_to_array from "@swc/helpers/src/_sliced_to_array.mjs";
import _to_consumable_array from "@swc/helpers/src/_to_consumable_array.mjs";
var ref = (_sliced_to_array([][0], 1)[0], _sliced_to_array([][1], 1));
_sliced_to_array(ref[0], 1)[0];
var _undefined = _sliced_to_array(void 0, 2), ref1 = (_sliced_to_array(_undefined[0], 1)[0], _sliced_to_array(_undefined[1], 1));
_sliced_to_array(ref1[0], 1)[0];
var ref2 = _sliced_to_array([
    1,
    2,
    3
], 3);
ref2[0], ref2[1], ref2[2];
var temp = [
    1,
    2,
    3
], ref3 = _sliced_to_array(_to_consumable_array(temp), 2);
ref3[0], ref3[1];
var ref4 = _sliced_to_array(_to_consumable_array(temp), 2);
ref4[0], ref4[1];
var ref5 = _sliced_to_array({
    2: !0
}, 3);
ref5[0], ref5[1], ref5[2];
