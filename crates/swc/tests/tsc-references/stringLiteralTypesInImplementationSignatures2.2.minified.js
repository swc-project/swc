//// [stringLiteralTypesInImplementationSignatures2.ts]
// String literal types are only valid in overload signatures
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _define_property } from "@swc/helpers/_/_define_property";
_define_property({
    foo: function(x) {}
}, "foo", function(x) {});
