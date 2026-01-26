//// [destructuringEvaluationOrder.ts]
import { _ as _extends } from "@swc/helpers/_/_extends";
import { _ as _object_destructuring_empty } from "@swc/helpers/_/_object_destructuring_empty";
import { _ as _object_without_properties } from "@swc/helpers/_/_object_without_properties";
import { _ as _sliced_to_array } from "@swc/helpers/_/_sliced_to_array";
import { _ as _to_array } from "@swc/helpers/_/_to_array";
import { _ as _to_property_key } from "@swc/helpers/_/_to_property_key";
// https://github.com/microsoft/TypeScript/issues/39205
var trace = [];
var order = function order(n) {
    return trace.push(n);
};
// order(0) should evaluate before order(1) because the first element is undefined
var _ref = [], tmp = _ref[0], _ref1 = tmp === void 0 ? order(0) : tmp, x = _ref1[order(1)];
// order(0) should not evaluate because the first element is defined
var tmp1 = {}, _ref2 = tmp1 === void 0 ? order(0) : tmp1, y = _ref2[order(1)];
// order(0) should evaluate first (destructuring of object literal {})
// order(1) should evaluate next (initializer because property is undefined)
// order(2) should evaluate last (evaluate object binding pattern from initializer)
var _ref3 = {}, _key = order(0), tmp2 = _ref3[_key], _ref4 = tmp2 === void 0 ? order(1) : tmp2, z = _ref4[order(2)], w = _object_without_properties(_ref3, [
    _to_property_key(_key)
]);
// https://github.com/microsoft/TypeScript/issues/39181
// b = a must occur *after* 'a' has been assigned
var _ref5 = [
    {
        x: 1
    }
], _ref6 = _to_array(_ref5), _ref7 = _ref6[0], _rest = _ref6.slice(1), ref = _object_destructuring_empty(_ref7), a = _extends({}, _ref7), _rest1 = _sliced_to_array(_rest, 1), tmp3 = _rest1[0], b = tmp3 === void 0 ? a : tmp3;
