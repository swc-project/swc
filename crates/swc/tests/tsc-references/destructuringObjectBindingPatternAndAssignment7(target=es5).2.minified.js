//// [destructuringObjectBindingPatternAndAssignment7.ts]
import { _ as _define_property } from "@swc/helpers/_/_define_property";
(K = {}).a = "a", K.b = "b";
var K, _obj, _ref = (_define_property(_obj = {}, "a", 1), _define_property(_obj, "b", 1), _obj);
console.log(_ref.a, _ref.b);
