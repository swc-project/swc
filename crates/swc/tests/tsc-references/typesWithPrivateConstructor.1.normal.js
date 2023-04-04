//// [typesWithPrivateConstructor.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var C = function C() {
    "use strict";
    _class_call_check(this, C);
};
var c = new C(); // error C is private
var r = c.constructor;
var C2 = function C2(x) {
    "use strict";
    _class_call_check(this, C2);
};
var c2 = new C2(); // error C2 is private
var r2 = c2.constructor;
