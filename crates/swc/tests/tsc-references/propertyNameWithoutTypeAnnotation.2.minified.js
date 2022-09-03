//// [propertyNameWithoutTypeAnnotation.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var a, C = function C() {
    "use strict";
    _class_call_check(this, C);
}, b = {
    foo: null
}, r1 = new C().foo, r2 = null.foo, r3 = a.foo, r4 = b.foo;
