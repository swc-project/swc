//// [destructuringAssignabilityCheck.ts]
import { _ as _object_destructuring_empty } from "@swc/helpers/_/_object_destructuring_empty";
import { _ as _sliced_to_array } from "@swc/helpers/_/_sliced_to_array";
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
