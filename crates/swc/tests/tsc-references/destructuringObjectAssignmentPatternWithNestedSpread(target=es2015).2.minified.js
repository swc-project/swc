//// [destructuringObjectAssignmentPatternWithNestedSpread.ts]
var _c;
import _object_without_properties from "@swc/helpers/src/_object_without_properties.mjs";
let a, b, c = {
    x: {
        a: 1,
        y: 2
    }
}, d;
b = _object_without_properties((_c = c).x, [
    "a"
]), { x: { a  } = d  } = _c;
