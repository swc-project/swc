import _extends from "@swc/helpers/lib/_extends.js";
import _object_without_properties from "@swc/helpers/lib/_object_without_properties.js";
import _to_property_key from "@swc/helpers/lib/_to_property_key.js";
// @target: es5,es2015
// @noTypesAndSymbols: true
// https://github.com/microsoft/TypeScript/issues/39205
let trace = [];
let order = (n)=>trace.push(n);
// order(0) should evaluate before order(1) because the first element is undefined
let [{ [order(1)]: x  } = order(0)] = [];
// order(0) should not evaluate because the first element is defined
let [{ [order(1)]: y  } = order(0)] = [
    {}
];
// order(0) should evaluate first (destructuring of object literal {})
// order(1) should evaluate next (initializer because property is undefined)
// order(2) should evaluate last (evaluate object binding pattern from initializer)
let _ref = {}, key = order(0), key1 = order(2), { [key]: { [key1]: z  } = order(1)  } = _ref, w = _object_without_properties(_ref, [
    key
].map(_to_property_key));
// https://github.com/microsoft/TypeScript/issues/39181
// b = a must occur *after* 'a' has been assigned
let _ref1 = [
    {
        x: 1
    }
], [{}, b = a] = _ref1, a = _extends({}, _ref1[0]);
