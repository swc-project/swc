//// [classStaticBlock1.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var a = 2;
var C = function C() {
    "use strict";
    _class_call_check(this, C);
};
(function() {
    var a = 1;
    a;
})();
