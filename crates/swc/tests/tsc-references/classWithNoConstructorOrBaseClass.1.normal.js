//// [classWithNoConstructorOrBaseClass.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var C = function C() {
    "use strict";
    _class_call_check(this, C);
};
var c = new C();
var r = C;
var D = function D() {
    "use strict";
    _class_call_check(this, D);
};
var d = new D();
var d2 = new D();
var r2 = D;
