//// [staticMemberInitialization.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var C = function C() {
    "use strict";
    _class_call_check(this, C);
};
(function() {
    C.x = 1;
})();
var c = new C();
var r = C.x;
