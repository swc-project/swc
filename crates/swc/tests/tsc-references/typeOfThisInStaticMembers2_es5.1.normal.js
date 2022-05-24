import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
var C = function C() {
    "use strict";
    _class_call_check(this, C);
};
C.foo = C // ok
;
var C2 = function C2() {
    "use strict";
    _class_call_check(this, C2);
};
C2.foo = C2 // ok
;
