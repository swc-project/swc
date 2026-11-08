//// [propertyNameWithoutTypeAnnotation.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
new function C() {
    _class_call_check(this, C);
}().foo, null.foo, (void 0).foo;
