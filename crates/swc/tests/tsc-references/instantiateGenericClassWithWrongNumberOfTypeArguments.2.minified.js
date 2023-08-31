//// [instantiateGenericClassWithWrongNumberOfTypeArguments.ts]
// it is always an error to provide a type argument list whose count does not match the type parameter list
// both of these attempts to construct a type is an error
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
new function C() {
    _class_call_check(this, C);
}(), new function D() {
    _class_call_check(this, D);
}();
