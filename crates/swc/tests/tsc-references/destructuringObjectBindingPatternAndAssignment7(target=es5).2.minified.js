//// [destructuringObjectBindingPatternAndAssignment7.ts]
import { _ as _define_property } from "@swc/helpers/_/_define_property";
var K, _obj, K1 = ((K = K1 || {}).a = "a", K.b = "b", K), _ref = (_define_property(_obj = {}, K1.a, 1), _define_property(_obj, K1.b, 1), _obj);
console.log(_ref[K1.a], _ref[K1.b]);
