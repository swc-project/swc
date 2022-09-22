//// [destructuringObjectAssignmentPatternWithNestedSpread.ts]
var _c;
let a, d;
import _object_without_properties from "@swc/helpers/src/_object_without_properties.mjs";
_object_without_properties((_c = {
    x: {
        a: 1,
        y: 2
    }
}).x, [
    "a"
]), { x: { a  } = d  } = _c;
