//// [destructuringObjectBindingPatternAndAssignment5.ts]
import { _ as _object_without_properties } from "@swc/helpers/_/_object_without_properties";
function a() {
    var _ref;
    var x;
    var y;
    _ref = {}, x = _ref.x, y = _object_without_properties(_ref, [
        "x"
    ]), _ref;
}
