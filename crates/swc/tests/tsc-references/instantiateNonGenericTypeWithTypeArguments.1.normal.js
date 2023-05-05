//// [instantiateNonGenericTypeWithTypeArguments.ts]
// it is an error to provide type arguments to a non-generic call
// all of these are errors
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var C = function C() {
    "use strict";
    _class_call_check(this, C);
};
var c = new C();
function Foo() {}
var r = new Foo();
var f;
var r2 = new f();
var a;
// BUG 790977
var r2 = new a();
