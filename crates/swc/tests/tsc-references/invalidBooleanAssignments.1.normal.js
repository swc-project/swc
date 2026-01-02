//// [invalidBooleanAssignments.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var x = true;
var a = x;
var b = x;
var c = x;
var d = x;
var E = /*#__PURE__*/ function(E) {
    E[E["A"] = 0] = "A";
    return E;
}(E || {});
var e = x;
var C = function C() {
    "use strict";
    _class_call_check(this, C);
};
var f = x;
var g = x;
var h = x;
var h2 = x; // no error
(function(M) {
    M.a = 1;
})(M || (M = {}));
M = x;
function i(a) {
    a = x;
}
i = x;
var M;
