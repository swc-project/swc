//// [destructuringEvaluationOrder.ts]
import { _ as _extends } from "@swc/helpers/_/_extends";
import { _ as _object_without_properties } from "@swc/helpers/_/_object_without_properties";
import { _ as _to_property_key } from "@swc/helpers/_/_to_property_key";
let trace = [], [{ [trace.push(1)]: x } = trace.push(0)] = [], [{ [trace.push(1)]: y } = trace.push(0)] = [
    {}
], _ref = {}, _key = trace.push(0), { [_key]: { [trace.push(2)]: z } = trace.push(1) } = _ref;
_object_without_properties(_ref, [
    _to_property_key(_key)
]);
let [_ref2, ..._rest] = [
    {
        x: 1
    }
], {} = _ref2, a = _extends({}, _ref2), [b = a] = _rest;
