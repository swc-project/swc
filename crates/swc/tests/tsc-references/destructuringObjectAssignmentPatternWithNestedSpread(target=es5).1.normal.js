//// [destructuringObjectAssignmentPatternWithNestedSpread.ts]
import { _ as _object_without_properties } from "@swc/helpers/_/_object_without_properties";
var _ref, _ref1;
var a, b, c = {
    x: {
        a: 1,
        y: 2
    }
}, d;
var ref, ref1;
_ref = c, ref = _ref, ref1 = ref.x, _ref1 = ref1 === void 0 ? d : ref1, ref, a = _ref1.a, b = _object_without_properties(_ref1, [
    "a"
]), _ref;
