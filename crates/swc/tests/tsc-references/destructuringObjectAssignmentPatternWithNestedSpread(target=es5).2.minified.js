//// [destructuringObjectAssignmentPatternWithNestedSpread.ts]
import _object_without_properties from "@swc/helpers/src/_object_without_properties.mjs";
var _c, ref, ref1, a, b, d, c = {
    x: {
        a: 1,
        y: 2
    }
};
b = _object_without_properties((_c = c).x, [
    "a"
]), a = (void 0 === (ref1 = (ref = _c).x) ? d : ref1).a;
