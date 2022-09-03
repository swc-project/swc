//// [destructuringEvaluationOrder.ts]
import _extends from "@swc/helpers/src/_extends.mjs";
import _object_without_properties from "@swc/helpers/src/_object_without_properties.mjs";
import _sliced_to_array from "@swc/helpers/src/_sliced_to_array.mjs";
import _throw from "@swc/helpers/src/_throw.mjs";
import _to_property_key from "@swc/helpers/src/_to_property_key.mjs";
var trace = [], order = function(n) {
    return trace.push(n);
}, ref = [], tmp = ref[0], ref1 = void 0 === tmp ? order(0) : tmp, x = ref1[order(1)], tmp1 = {}, ref2 = void 0 === tmp1 ? order(0) : tmp1, y = ref2[order(1)], _ref = {}, key = order(0), key1 = order(2), tmp2 = _ref[key], ref3 = void 0 === tmp2 ? order(1) : tmp2, z = ref3[key1], w = _object_without_properties(_ref, [
    key
].map(_to_property_key)), _ref1 = [
    {
        x: 1
    }
], __ref = _sliced_to_array(_ref1, 2), ref4 = __ref[0], ref4 = null !== ref4 ? ref4 : _throw(new TypeError("Cannot destructure undefined")), tmp3 = __ref[1], b = void 0 === tmp3 ? a : tmp3, a = _extends({}, _ref1[0]);
