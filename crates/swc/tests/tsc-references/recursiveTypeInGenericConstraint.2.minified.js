//// [recursiveTypeInGenericConstraint.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
new function Foo() {
    _class_call_check(this, Foo);
}(); // ok, circularity in assignment compat check causes success
