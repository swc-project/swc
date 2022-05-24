import _define_property from "@swc/helpers/lib/_define_property.js";
//@target: ES6
var obj = _define_property({}, Symbol.nonsense, 0);
obj = {};
obj[Symbol.nonsense];
