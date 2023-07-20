//// [destructuringObjectBindingPatternAndAssignment7.ts]
import { _ as _define_property } from "@swc/helpers/_/_define_property";
(K = K1 || (K1 = {})).a = "a", K.b = "b";
var K, K1, _ref = function() {
    var _obj;
    return _define_property(_obj = {}, K1.a, 1), _define_property(_obj, K1.b, 1), _obj;
}();
console.log(_ref[K1.a], _ref[K1.b]);
