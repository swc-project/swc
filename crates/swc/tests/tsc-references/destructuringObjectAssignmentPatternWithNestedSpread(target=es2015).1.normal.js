//// [destructuringObjectAssignmentPatternWithNestedSpread.ts]
import { _ as _object_without_properties } from "@swc/helpers/_/_object_without_properties";
var _ref, _ref1;
let a, b, c = {
    x: {
        a: 1,
        y: 2
    }
}, d;
_ref = c, ({ x: _ref1 = d } = _ref), ({ a } = _ref1), b = _object_without_properties(_ref1, [
    "a"
]), _ref;
