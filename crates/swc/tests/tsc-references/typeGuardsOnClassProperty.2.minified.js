//// [typeGuardsOnClassProperty.ts]
// Note that type guards affect types of variables and parameters only and 
// have no effect on members of objects such as properties. 
// Note that the class's property must be copied to a local variable for
// the type guard to have an effect
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var o = {
    prop1: "string"
};
"string" == typeof o.prop1 && o.prop1.toLowerCase();
var prop1 = o.prop1;
"string" == typeof prop1 && prop1.toLocaleLowerCase();
