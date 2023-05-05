//// [destructuringObjectAssignmentPatternWithNestedSpread.ts]
var _c, ref1, d;
import { _ as _object_without_properties } from "@swc/helpers/_/_object_without_properties";
_object_without_properties((_c = {
    x: {
        a: 1,
        y: 2
    }
}).x, [
    "a"
]), (void 0 === (ref1 = _c.x) ? d : ref1).a;
