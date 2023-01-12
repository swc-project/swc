//// [destructuringObjectAssignmentPatternWithNestedSpread.ts]
var _c, ref1, d;
import _object_without_properties from "@swc/helpers/src/_object_without_properties.mjs";
_object_without_properties((_c = {
    x: {
        a: 1,
        y: 2
    }
}).x, [
    "a"
]), (void 0 === (ref1 = _c.x) ? d : ref1).a;
