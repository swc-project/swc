//// [destructuringObjectAssignmentPatternWithNestedSpread.ts]
var _ref;
let a, d;
import { _ as _object_without_properties } from "@swc/helpers/_/_object_without_properties";
({ x: _ref = d } = {
    x: {
        a: 1,
        y: 2
    }
}), ({ a } = _ref), _object_without_properties(_ref, [
    "a"
]);
