//// [usage.js]
// note that usage is first in the compilation
var x;
Outer.Inner.Message = function() {}, new Outer.Inner().name, x.name;
//// [def.js]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
