//// [destructuringObjectAssignmentPatternWithNestedSpread.ts]
import { _ as _object_without_properties } from "@swc/helpers/_/_object_without_properties";
var a, b, c = {
    x: {
        a: 1,
        y: 2
    }
}, d;
var _c;
var ref, ref1;
_c = c, b = _object_without_properties(_c.x, [
    "a"
]), ref = _c, ref1 = ref.x, a = (ref1 === void 0 ? d : ref1).a, ref, _c;
