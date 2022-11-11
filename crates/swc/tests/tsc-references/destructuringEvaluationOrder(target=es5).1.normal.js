//// [destructuringEvaluationOrder.ts]
// https://github.com/microsoft/TypeScript/issues/39205
import _extends from "@swc/helpers/src/_extends.mjs";
import _object_without_properties from "@swc/helpers/src/_object_without_properties.mjs";
import _sliced_to_array from "@swc/helpers/src/_sliced_to_array.mjs";
import _throw from "@swc/helpers/src/_throw.mjs";
import _to_property_key from "@swc/helpers/src/_to_property_key.mjs";
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
], _ref6 = _sliced_to_array(_ref5, 2), _ref_ = _ref6[0], _ref_ = _ref_ !== null ? _ref_ : _throw(new TypeError("Cannot destructure undefined")), tmp3 = _ref6[1], b = tmp3 === void 0 ? a : tmp3, a = _extends({}, _ref5[0]);
