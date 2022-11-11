//// [destructuringObjectBindingPatternAndAssignment6.ts]
import _define_property from "@swc/helpers/src/_define_property.mjs";
var _ref = function() {
    var _obj;
    return _define_property(_obj = {}, "a", 1), _define_property(_obj, "b", 1), _obj;
}();
console.log(_ref.a, _ref.b);
