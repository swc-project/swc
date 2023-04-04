//// [destructuringObjectBindingPatternAndAssignment6.ts]
import { _ as _define_property } from "@swc/helpers/_/_define_property";
var a = "a";
var b = "b";
var _ref = function() {
    var _obj;
    return _obj = {}, _define_property(_obj, a, 1), _define_property(_obj, b, 1), _obj;
}(), aVal = _ref[a], bVal = _ref[b];
console.log(aVal, bVal);
