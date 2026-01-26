//// [destructuringEvaluationOrder.ts]
import { _ as _extends } from "@swc/helpers/_/_extends";
import { _ as _object_destructuring_empty } from "@swc/helpers/_/_object_destructuring_empty";
import { _ as _object_without_properties } from "@swc/helpers/_/_object_without_properties";
import { _ as _sliced_to_array } from "@swc/helpers/_/_sliced_to_array";
import { _ as _to_array } from "@swc/helpers/_/_to_array";
import { _ as _to_property_key } from "@swc/helpers/_/_to_property_key";
var trace = [], order = function(n) {
    return trace.push(n);
}, tmp = void 0;
(void 0 === tmp ? order(0) : tmp)[order(1)];
var tmp1 = {};
(void 0 === tmp1 ? order(0) : tmp1)[order(1)];
var _ref3 = {}, _key = order(0), tmp2 = _ref3[_key];
(void 0 === tmp2 ? order(1) : tmp2)[order(2)], _object_without_properties(_ref3, [
    _to_property_key(_key)
]);
var _ref6 = _to_array([
    {
        x: 1
    }
]), _ref7 = _ref6[0], _rest = _ref6.slice(1);
_object_destructuring_empty(_ref7), _extends({}, _ref7), _sliced_to_array(_rest, 1)[0];
