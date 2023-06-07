//// [destructuringObjectAssignmentPatternWithNestedSpread.ts]
var _c;
let a, d;
import { _ as _object_without_properties } from "@swc/helpers/_/_object_without_properties";
_object_without_properties((_c = {
    x: {
        a: 1,
        y: 2
    }
}).x, [
    "a"
]), { x: { a } = d } = _c;
