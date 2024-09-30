//// [invalidUndefinedAssignments.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var x;
var E = /*#__PURE__*/ function(E) {
    E[E["A"] = 0] = "A";
    return E;
}(E || {});
E = x;
E.A = x;
var C = function C() {
    "use strict";
    _class_call_check(this, C);
};
var f;
C = x;
var g;
g = x;
I = x;
(function(M) {
    M.x = 1;
})(M || (M = {}));
M = x;
function i(a) {}
// BUG 767030
i = x;
var M;
