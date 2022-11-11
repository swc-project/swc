//// [destructuringObjectBindingPatternAndAssignment8.ts]
import _define_property from "@swc/helpers/src/_define_property.mjs";
var K = {
    a: "a",
    b: "b"
}, _ref = function() {
    var _obj;
    return _define_property(_obj = {}, K.a, 1), _define_property(_obj, K.b, 1), _obj;
}();
console.log(_ref[K.a], _ref[K.b]);
