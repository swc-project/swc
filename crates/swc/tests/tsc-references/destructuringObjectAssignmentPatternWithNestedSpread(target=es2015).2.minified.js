//// [destructuringObjectAssignmentPatternWithNestedSpread.ts]
var _ref1;
let a, d;
import { _ as _object_without_properties } from "@swc/helpers/_/_object_without_properties";
({ x: _ref1 = d } = {
    x: {
        a: 1,
        y: 2
    }
}), ({ a } = _ref1), _object_without_properties(_ref1, [
    "a"
]);
