//// [typeOfThisInStaticMembers2.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var C = function C() {
    "use strict";
    _class_call_check(this, C);
};
(function() {
    C.foo = C // ok
    ;
})();
var C2 = function C2() {
    "use strict";
    _class_call_check(this, C2);
};
(function() {
    C2.foo = C2 // ok
    ;
})();
