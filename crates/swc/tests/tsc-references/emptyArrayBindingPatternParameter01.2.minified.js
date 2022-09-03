//// [emptyArrayBindingPatternParameter01.ts]
import _sliced_to_array from "@swc/helpers/src/_sliced_to_array.mjs";
function f(param) {
    _sliced_to_array(param, 0);
}
