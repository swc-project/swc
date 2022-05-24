import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
var C = function C() {
    "use strict";
    _class_call_check(this, C);
};
var a;
var b = {
    foo: null
};
// These should all be of type 'any'
var r1 = new C().foo;
var r2 = null.foo;
var r3 = a.foo;
var r4 = b.foo;
