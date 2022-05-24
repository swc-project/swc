import _define_property from "@swc/helpers/lib/_define_property.js";
//@target: ES6
var obj = _define_property({}, Symbol.iterator, 0);
// Should give type 'any'.
obj[Symbol["nonsense"]];
