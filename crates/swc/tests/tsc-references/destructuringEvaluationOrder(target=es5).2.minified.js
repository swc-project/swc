//// [destructuringEvaluationOrder.ts]
import _extends from "@swc/helpers/src/_extends.mjs";
import _object_destructuring_empty from "@swc/helpers/src/_object_destructuring_empty.mjs";
import _object_without_properties from "@swc/helpers/src/_object_without_properties.mjs";
import _sliced_to_array from "@swc/helpers/src/_sliced_to_array.mjs";
import _to_property_key from "@swc/helpers/src/_to_property_key.mjs";
var trace = [], order = function(n) {
    return trace.push(n);
}, tmp = [][0];
(void 0 === tmp ? order(0) : tmp)[order(1)];
var tmp1 = {};
(void 0 === tmp1 ? order(0) : tmp1)[order(1)];
var _ref3 = {}, _order = order(0), _order1 = order(2), tmp2 = _ref3[_order];
(void 0 === tmp2 ? order(1) : tmp2)[_order1], _object_without_properties(_ref3, [
    _order
].map(_to_property_key));
var _ref5 = [
    {
        x: 1
    }
], _ref6 = _sliced_to_array(_ref5, 2);
_object_destructuring_empty(_ref6[0]), _ref6[1], _extends({}, _object_destructuring_empty(_ref5[0]));
