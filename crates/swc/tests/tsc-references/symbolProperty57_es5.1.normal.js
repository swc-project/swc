//@target: ES6
import _define_property from "@swc/helpers/src/_define_property.mjs";
var obj = _define_property({}, Symbol.iterator, 0);
// Should give type 'any'.
obj[Symbol["nonsense"]];
