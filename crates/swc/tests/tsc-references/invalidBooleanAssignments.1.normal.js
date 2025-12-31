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
(function(_$M) {
    _$M.a = 1;
})(_$M || (_$M = {}));
_$M = x;
function i(a) {
    a = x;
    var _$M;
}
i = x;
