//// [destructuringObjectBindingPatternAndAssignment5.ts]
import { _ as _object_without_properties } from "@swc/helpers/_/_object_without_properties";
function a() {
    var x;
    var y;
    var _tmp;
    _tmp = {}, y = _object_without_properties(_tmp, [
        "x"
    ]), x = _tmp.x, _tmp;
}
