//// [classStaticBlock9.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var A = function A() {
    "use strict";
    _class_call_check(this, A);
};
A.bar = A.foo + 1;
(function() {
    A.foo + 2;
})();
A.foo = 1;
