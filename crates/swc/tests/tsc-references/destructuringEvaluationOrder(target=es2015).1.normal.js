//// [destructuringEvaluationOrder.ts]
import { _ as _extends } from "@swc/helpers/_/_extends";
import { _ as _object_without_properties } from "@swc/helpers/_/_object_without_properties";
import { _ as _to_property_key } from "@swc/helpers/_/_to_property_key";
// https://github.com/microsoft/TypeScript/issues/39205
let trace = [];
let order = (n)=>trace.push(n);
// order(0) should evaluate before order(1) because the first element is undefined
let [{ [order(1)]: x } = order(0)] = [];
// order(0) should not evaluate because the first element is defined
let [{ [order(1)]: y } = order(0)] = [
    {}
];
// order(0) should evaluate first (destructuring of object literal {})
// order(1) should evaluate next (initializer because property is undefined)
// order(2) should evaluate last (evaluate object binding pattern from initializer)
let _ref = {}, _key = order(0), { [_key]: { [order(2)]: z } = order(1) } = _ref, w = _object_without_properties(_ref, [
    _to_property_key(_key)
]);
// https://github.com/microsoft/TypeScript/issues/39181
// b = a must occur *after* 'a' has been assigned
let _ref1 = [
    {
        x: 1
    }
], [_ref2, ..._rest] = _ref1, {} = _ref2, a = _extends({}, _ref2), [b = a] = _rest;
