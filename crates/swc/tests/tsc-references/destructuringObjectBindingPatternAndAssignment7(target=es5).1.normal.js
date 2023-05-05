//// [destructuringObjectBindingPatternAndAssignment7.ts]
import { _ as _define_property } from "@swc/helpers/_/_define_property";
var K;
(function(K) {
    K["a"] = "a";
    K["b"] = "b";
})(K || (K = {}));
var _ref = function() {
    var _obj;
    return _obj = {}, _define_property(_obj, K.a, 1), _define_property(_obj, K.b, 1), _obj;
}(), aVal = _ref[K.a], bVal = _ref[K.b];
console.log(aVal, bVal);
