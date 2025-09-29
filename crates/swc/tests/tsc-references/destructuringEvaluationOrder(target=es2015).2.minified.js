//// [destructuringEvaluationOrder.ts]
import { _ as _extends } from "@swc/helpers/_/_extends";
import { _ as _object_destructuring_empty } from "@swc/helpers/_/_object_destructuring_empty";
import { _ as _object_without_properties } from "@swc/helpers/_/_object_without_properties";
import { _ as _to_property_key } from "@swc/helpers/_/_to_property_key";
let trace = [], [{ [trace.push(1)]: x } = trace.push(0)] = [], [{ [trace.push(1)]: y } = trace.push(0)] = [
    {}
], _ref = {}, _order = trace.push(0), _order1 = trace.push(2), { [_order]: { [_order1]: z } = trace.push(1) } = _ref;
_object_without_properties(_ref, [
    _order
].map(_to_property_key));
let _ref1 = [
    {
        x: 1
    }
], [{}, b = a] = _ref1, a = _extends({}, _object_destructuring_empty(_ref1[0]));
