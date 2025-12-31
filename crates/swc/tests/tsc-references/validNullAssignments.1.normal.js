//// [validNullAssignments.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var a = null;
var b = null;
var c = null;
var d = null;
var e = null;
e = null; // ok
var E = /*#__PURE__*/ function(E) {
    E[E["A"] = 0] = "A";
    return E;
}(E || {});
E.A = null; // error
var C = function C() {
    "use strict";
    _class_call_check(this, C);
};
var f;
f = null; // ok
C = null; // error
var g;
g = null; // ok
I = null; // error
(function(_$M) {
    _$M.x = 1;
})(_$M || (_$M = {}));
_$M = null; // error
var h = null;
function i(a) {
    a = null;
    var _$M;
}
i = null; // error
