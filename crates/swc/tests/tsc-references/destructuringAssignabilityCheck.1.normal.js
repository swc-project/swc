//// [destructuringAssignabilityCheck.ts]
import _object_destructuring_empty from "@swc/helpers/src/_object_destructuring_empty.mjs";
import _sliced_to_array from "@swc/helpers/src/_sliced_to_array.mjs";
var _ref = _sliced_to_array({}, 0); // should be error
var ref = _object_destructuring_empty(undefined); // error correctly
(function(param) {
    var _param = _sliced_to_array(param, 0);
    return 0;
})({}); // should be error
(function(param) {
    var ref = _object_destructuring_empty(param);
    return 0;
})(undefined); // should be error
function foo(param) {
    var ref = _object_destructuring_empty(param);
    return 0;
}
function bar(param) {
    var _param = _sliced_to_array(param, 0);
    return 0;
}
var ref1 = _object_destructuring_empty(1);
var _ref1 = _sliced_to_array({}, 0);
