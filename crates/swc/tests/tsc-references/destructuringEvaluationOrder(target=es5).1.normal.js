//// [destructuringEvaluationOrder.ts]
// https://github.com/microsoft/TypeScript/issues/39205
import { _ as _extends } from "@swc/helpers/_/_extends";
import { _ as _object_destructuring_empty } from "@swc/helpers/_/_object_destructuring_empty";
import { _ as _object_without_properties } from "@swc/helpers/_/_object_without_properties";
import { _ as _sliced_to_array } from "@swc/helpers/_/_sliced_to_array";
import { _ as _to_property_key } from "@swc/helpers/_/_to_property_key";
var trace = [];
var order = function(n) {
    return trace.push(n);
};
// order(0) should evaluate before order(1) because the first element is undefined
var _ref = [], tmp = _ref[0], _ref1 = tmp === void 0 ? order(0) : tmp, x = _ref1[order(1)];
// order(0) should not evaluate because the first element is defined
var tmp1 = {}, _ref2 = tmp1 === void 0 ? order(0) : tmp1, y = _ref2[order(1)];
// order(0) should evaluate first (destructuring of object literal {})
// order(1) should evaluate next (initializer because property is undefined)
// order(2) should evaluate last (evaluate object binding pattern from initializer)
var _ref3 = {}, _order = order(0), _order1 = order(2), tmp2 = _ref3[_order], _ref4 = tmp2 === void 0 ? order(1) : tmp2, z = _ref4[_order1], w = _object_without_properties(_ref3, [
    _order
].map(_to_property_key));
// https://github.com/microsoft/TypeScript/issues/39181
// b = a must occur *after* 'a' has been assigned
var _ref5 = [
    {
        x: 1
    }
], _ref6 = _sliced_to_array(_ref5, 2), ref = _object_destructuring_empty(_ref6[0]), tmp3 = _ref6[1], b = tmp3 === void 0 ? a : tmp3, a = _extends({}, _object_destructuring_empty(_ref5[0]));
