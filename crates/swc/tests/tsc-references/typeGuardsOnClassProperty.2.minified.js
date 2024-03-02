//// [typeGuardsOnClassProperty.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var o = {
    prop1: "string"
};
"string" == typeof o.prop1 && o.prop1.toLowerCase();
var prop1 = o.prop1;
"string" == typeof prop1 && prop1.toLocaleLowerCase();
