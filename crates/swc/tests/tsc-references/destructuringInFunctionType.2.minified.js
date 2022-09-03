//// [destructuringInFunctionType.ts]
import _sliced_to_array from "@swc/helpers/src/_sliced_to_array.mjs";
var v2, v1 = function(param) {
    var _param = _sliced_to_array(param, 3);
    return _param[0], _param[1], _param[2], "hello";
};
