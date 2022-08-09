// #35497
// @target: es5
// @downlevelIteration: true
// @lib: es6
// @strict: true
import _sliced_to_array from "@swc/helpers/src/_sliced_to_array.mjs";
var _data = _sliced_to_array(data, 1), value = _data[0]; // Error
