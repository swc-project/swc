//// [destructuringObjectBindingPatternAndAssignment6.ts]
import { _ as _define_property } from "@swc/helpers/_/_define_property";
var _ref = function() {
    var _obj;
    return _define_property(_obj = {}, "a", 1), _define_property(_obj, "b", 1), _obj;
}();
console.log(_ref.a, _ref.b);
