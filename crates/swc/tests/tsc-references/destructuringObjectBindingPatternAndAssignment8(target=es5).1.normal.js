//// [destructuringObjectBindingPatternAndAssignment8.ts]
import { _ as _define_property } from "@swc/helpers/_/_define_property";
var K = {
    a: "a",
    b: "b"
};
var _ref = function() {
    var _obj;
    return _obj = {}, _define_property(_obj, K.a, 1), _define_property(_obj, K.b, 1), _obj;
}(), aVal = _ref[K.a], bVal = _ref[K.b];
console.log(aVal, bVal);
