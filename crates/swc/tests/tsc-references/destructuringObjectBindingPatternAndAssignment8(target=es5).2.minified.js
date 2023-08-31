//// [destructuringObjectBindingPatternAndAssignment8.ts]
import { _ as _define_property } from "@swc/helpers/_/_define_property";
var _obj, K = {
    a: "a",
    b: "b"
}, _ref = (_define_property(_obj = {}, K.a, 1), _define_property(_obj, K.b, 1), _obj);
console.log(_ref[K.a], _ref[K.b]);
