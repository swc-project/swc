//// [destructuringObjectAssignmentPatternWithNestedSpread.ts]
import { _ as _object_without_properties } from "@swc/helpers/_/_object_without_properties";
var _ref;
let a, b, c = {
    x: {
        a: 1,
        y: 2
    }
}, d;
({ x: _ref = d } = c), ({ a } = _ref), b = _object_without_properties(_ref, [
    "a"
]), c;
