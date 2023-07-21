//// [destructuringEvaluationOrder.ts]
// https://github.com/microsoft/TypeScript/issues/39205
import { _ as _extends } from "@swc/helpers/_/_extends";
import { _ as _object_destructuring_empty } from "@swc/helpers/_/_object_destructuring_empty";
import { _ as _object_without_properties } from "@swc/helpers/_/_object_without_properties";
import { _ as _to_property_key } from "@swc/helpers/_/_to_property_key";
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
let _ref = {}, _order = order(0), _order1 = order(2), { [_order]: { [_order1]: z } = order(1) } = _ref, w = _object_without_properties(_ref, [
    _order
].map(_to_property_key));
// https://github.com/microsoft/TypeScript/issues/39181
// b = a must occur *after* 'a' has been assigned
let _ref1 = [
    {
        x: 1
    }
], [{}, b = a] = _ref1, a = _extends({}, _object_destructuring_empty(_ref1[0]));
