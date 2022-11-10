//// [destructuringEvaluationOrder.ts]
import _extends from "@swc/helpers/src/_extends.mjs";
import _object_without_properties from "@swc/helpers/src/_object_without_properties.mjs";
import _to_property_key from "@swc/helpers/src/_to_property_key.mjs";
let trace = [], order = (n)=>trace.push(n), [{ [order(1)]: x  } = order(0)] = [], [{ [order(1)]: y  } = order(0)] = [
    {}
], _ref = {}, _order = order(0), _order1 = order(2), { [_order]: { [_order1]: z  } = order(1)  } = _ref;
_object_without_properties(_ref, [
    _order
].map(_to_property_key));
let _ref1 = [
    {
        x: 1
    }
], [{}, b = a] = _ref1, a = _extends({}, _ref1[0]);
