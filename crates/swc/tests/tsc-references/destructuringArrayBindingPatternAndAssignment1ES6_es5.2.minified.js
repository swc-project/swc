import _sliced_to_array from "@swc/helpers/src/_sliced_to_array.mjs";
import _to_array from "@swc/helpers/src/_to_array.mjs";
import _to_consumable_array from "@swc/helpers/src/_to_consumable_array.mjs";
var _undefined = _sliced_to_array(void 0, 2);
_undefined[0], _undefined[1];
var _undefined1 = _sliced_to_array(void 0, 2);
function foo() {
    return [
        1,
        2,
        3
    ];
}
_undefined1[0], _undefined1[1];
var ref = _sliced_to_array(foo(), 2);
ref[0], ref[1], _to_array(foo()).slice(0);
var ref1 = _sliced_to_array(_to_consumable_array([
    1,
    2,
    3
]), 2);
ref1[0], ref1[1];
