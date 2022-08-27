//// [destructuringArrayBindingPatternAndAssignment4.ts]
// #35497
import _sliced_to_array from "@swc/helpers/src/_sliced_to_array.mjs";
var _data = _sliced_to_array(data, 1), value = _data[0]; // Error
