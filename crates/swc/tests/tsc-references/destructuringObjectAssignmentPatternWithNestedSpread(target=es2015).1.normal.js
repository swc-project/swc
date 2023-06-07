//// [destructuringObjectAssignmentPatternWithNestedSpread.ts]
import { _ as _object_without_properties } from "@swc/helpers/_/_object_without_properties";
let a, b, c = {
    x: {
        a: 1,
        y: 2
    }
}, d;
var _c;
_c = c, b = _object_without_properties(_c.x, [
    "a"
]), ({ x: { a } = d } = _c), _c;
