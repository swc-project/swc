//// [classStaticBlock2.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var a = 1;
var b = 2;
var C = function C() {
    "use strict";
    _class_call_check(this, C);
};
(function() {
    var a = 11;
    a;
    b;
})();
(function() {
    var a = 11;
    a;
    b;
})();
